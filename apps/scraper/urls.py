from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt
from apps.scraper.views import ScrapedRecipeItemView, scrape

router = DefaultRouter()
router.register("scrapedrecipe", ScrapedRecipeItemView, basename="scrapedrecipe")
scraper_urlpatterns = [re_path("api/v1/scraper", csrf_exempt(scrape)), re_path("api/v1/", include(router.urls))]
