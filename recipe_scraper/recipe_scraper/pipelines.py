# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from apps.scraper.models import ScrapedRecipeItem
import logging
import json
import re

logger = logging.getLogger()

class RecipeScraperPipeline:
    def __init__(self, unique_id, *args, **kwargs):
        self.unique_id = unique_id
        self.items = []

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            #this will be passed from django view
            unique_id = crawler.settings.get('unique_id')
        )

    def close_spider(self, spider):
        # this is where we are saving the crawled data with django models
        item = ScrapedRecipeItem.objects.get(unique_id=self.unique_id)
        # item.unique_id = self.unique_id
        logger.info('--------items------- %s', self.items)
        # item.data = json.dumps(self.items)
        # logger.info('--------items[0]------- %s', self.items[0])
        # logger.info('--------items[1]------- %s', self.items[1])
        # logger.info('--------items[2]------- %s', self.items[2])
        # logger.info('--------items[3]------- %s', self.items[3])
        # logger.info('--------items[4]------- %s', self.items[4])
        # logger.info('--------items[5]------- %s', self.items[5])
        item.url = self.items[0]
        item.title = self.items[1]
        item.author = self.items[2]
        item.description = self.items[3]
        item.img_src = self.items[4]
        # item.created_by = self.items[5]
        logger.info('--------Item------- %s', item)
        item.save()

    def process_item(self, item, spider):
        self.items.append(item['url'])
        self.items.append(item['title'])
        self.items.append(item['author'])
        re.sub('/<([^>]+)>/', '', item['description'])
        self.items.append(item['description'])
        self.items.append(item['img_src'])
        # self.items.append(item['created_by'])
        return item
