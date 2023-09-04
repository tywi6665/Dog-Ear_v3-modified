from django.urls import re_path, include
from rest_framework.routers import DefaultRouter
from apps.recipes.views import RecipeItemViewSet

router = DefaultRouter()
router.register("recipes", RecipeItemViewSet, basename="recipes")
recipes_urlpatterns = [re_path("api/v1/", include(router.urls))]