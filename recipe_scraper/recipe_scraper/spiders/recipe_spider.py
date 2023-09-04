import scrapy
from recipe_scraper.recipe_scraper.items import RecipeScraperItem
import re


class RecipeScraperSpider(scrapy.Spider):
    name = 'recipe_spider'

    # Dynamic methods that allows Django to pass values to crawler
    def __init__(self, *args, **kwargs):
        # going to pass these args from django view 
        # To make everything dynamic, we need to override them inside __init__ method
        self.url = kwargs.get('url')
        self.domain = kwargs.get('domain')
        # self.created_by = kwargs.get('created_by')
        self.start_urls = [self.url]
        self.allowed_domains = [self.domain]

    def parse(self, response):
        self.logger.info('--------Now scaping------- %s', self.url)
        self.logger.info('--------Domain------- %s', self.domain)
        # self.logger.info('--------Created By------- %s', self.created_by)

        # custom title case function that handles apostrophes
        def title_case(s):
            return re.sub(r"[A-Za-z]+('[A-Za-z]+)?",
                            lambda mo:
                            mo.group(0)[0].upper() +
                            mo.group(0)[1:].lower(), s)

        item = RecipeScraperItem()
        item['url'] = response.url

        # Defining defaults
        item['title'] = ''
        item['img_src'] = ''
        item['author'] = ''
        item['description'] = ''
        # item['created_by'] = self.created_by

        try:
            item['title'] = title_case(response.xpath("//meta[@property='og:title']/@content")[0].extract())
        except:
            print('An error has occurred while scraping the title')
        try:
            item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
        except:
            print('An error has occurred while scraping the image src')
        try:
            item['author'] = title_case(response.xpath("//meta[@name='sailthru.author']/@content")[0].extract())
        except:
            print('An error has occurred while scraping the author')
        try:
            item['description'] = response.xpath("//meta[@property='og:description']/@content")[0].extract()
        except:
            print('An error has occurred while scraping the description')

        self.logger.info('--------Item------- %s', item)
        
        return item
