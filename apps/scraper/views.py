import os
from rest_framework import viewsets 
from urllib.parse import urlparse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.views.decorators.http import  require_http_methods
from django.http import JsonResponse
# from scrapyd_api import ScrapydAPI
from rest_framework.response import Response
from rest_framework import status
from apps.scraper.serializers import ScrapedRecipeItemSerializer
from apps.scraper.models import ScrapedRecipeItem
import json

from scrapinghub import ScrapinghubClient
# apikey = '786e503ffaae4e619b1ef659cd2d9a73' # your API key as a string
client = ScrapinghubClient(os.getenv('SCRAPYCLOUD_API_KEY'))

class ScrapedRecipeItemView(viewsets.ModelViewSet):
    lookup_field = 'unique_id'
    serializer_class = ScrapedRecipeItemSerializer
    queryset = ScrapedRecipeItem.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

# connect to scrapyd service
# scrapyd = ScrapydAPI('http://localhost:6800/')

# url validation function
def is_valid_url(url):
    validate = URLValidator()
    try:
        validate(url) # check to see if url format is valid
    except ValidationError:
        return False
    return True

# crawling function
@require_http_methods(['POST', 'GET'])  # only get and post
def scrape(request):
    # POST requests == new crawling task
    print("------CLIENT LIST---------", client.projects.list())
    data = json.loads(request.body.decode('utf-8'))
    print("-----Data-----", data)
    if data.get('body').get('method') == 'POST':
        # take unique_id from client
        unique_id = data.get("body").get('unique_id', None)
        print("-----Unique ID-----", unique_id)
        # take url from client
        url = data.get("body").get('url', None)
        print("-----URL-----", url)
        # if url does not exist
        if not url:
            return JsonResponse({'error': 'Missing args'})
        # if url is not valid return error
        if not is_valid_url(url):
            return JsonResponse({'error': 'URL is invalid'})

        # parse the url and extract its domain
        domain = urlparse(url).netloc
        print("-----Domain-----", domain)

        user = data.get('body').get('user')
        print("-----User-----", user)
        # # create a unique id
        # unique_id = str(uuid4())
        # custom settings for scrapy spider
        settings = {
            'unique_id': unique_id, # unique id for each entry in DB
            'USER_AGENT': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }

        # schedule a new crawling task
        # return a id which will be used to check on the task's status
        print("-----Scheduling Spider-----")

        project = client.get_project(699195)
        job = project.jobs.run('recipe_spider', job_args={'url': url})
     
        print(job.key)

        # job = client.get_job(job.key)
        # for item in job.items.iter():
        #     print(item)

        # task = scrapyd.schedule(
        #     'default',
        #     'recipe_spider',
        #     settings=settings,
        #     url=url,
        #     domain=domain,
        #     created_by= user,
        #     )

        # return JsonResponse({
        #     'task_id': task,
        #     'unique_id': unique_id,
        #     'user': user,
        #     'status': 'started'
        # })

        return JsonResponse({
            'task_id': job.key,
            'unique_id': unique_id,
            'user': user,
            'status': 'started'
        })

    # GET requests are for checking on status of specific crawling task
    elif data.get('body').get('method') == 'GET':
        # if crawling is complete, then crawled data is returned
        print("-----Task ID-----", data.get('body').get('task_id'))
        print("-----Unique ID-----", data.get('body').get('unique_id'))
        
        task_id = data.get('body').get('task_id', None)
        print("-----Task ID-----", data.get('body').get('task_id'))
        unique_id = data.get('body').get('unique_id', None)
        user = data.get('body').get('user', None)

        job = client.get_job(task_id)

         # validate
        if not task_id or not unique_id:
            return JsonResponse({'error': 'Missing args'})

        metadata = job.metadata.get('scrapystats')
        status = 'default'
        if (metadata is not None):
            status = metadata.get('finish_reason')
        print(status)

        # check status of crawling task every few seconds.
        # if finished query from database and get results
        # else return active status
        # possible results are => pending, running, finished
        # status = scrapyd.job_status('default', task_id)
        if status == 'finished':
            recipe = None
            for item in job.items.iter():
                print(item)
                recipe = item
            recipe['unique_id'] = unique_id
            try:
                # this is the unique_id that was created above
                # item = ScrapedRecipeItem.objects.get(unique_id=unique_id)
                # title = RecipeItem.objects.get('title')
                print('------Item------', recipe)
                return JsonResponse({'data': item})
            except Exception as e:
                return JsonResponse({'error': str(e)})
        else:
            return JsonResponse({'status': status})
