from scrapy import Spider, Request
from scrapy.http import HtmlResponse


class Example(Spider):
    name = 'example'

    url = 'http://doc.scrapy.org/en/latest/_static/selectors-sample1.html'

    def start_requests(self):
        yield Request(self.url, self.parse)

    def parse(self, response):
        for href in response.xpath('//a/@href').extract():
            yield {'image_href': href}


# Test part
from betamax import Betamax
from betamax.fixtures.unittest import BetamaxTestCase


with Betamax.configure() as config:
    # where betamax will store cassettes (http responses):
    config.cassette_library_dir = 'cassettes'
    config.preserve_exact_body_bytes = True


class TestExample(BetamaxTestCase):  # superclass provides self.session

    def test_parse(self):
        example = Example()

        # http response is recorded in a betamax cassette:
        response = self.session.get(example.url)

        # forge a scrapy response to test
        scrapy_response = HtmlResponse(body=response.content, url=example.url)

        result = example.parse(scrapy_response)

        self.assertEqual({'image_href': u'image1.html'}, next(result))
        self.assertEqual({'image_href': u'image2.html'}, next(result))
        self.assertEqual({'image_href': u'image3.html'}, next(result))
        self.assertEqual({'image_href': u'image4.html'}, next(result))
        self.assertEqual({'image_href': u'image5.html'}, next(result))

        with self.assertRaises(StopIteration):
            next(result)