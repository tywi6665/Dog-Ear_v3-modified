from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets 
from django_filters import rest_framework as filters
from rest_framework.filters import OrderingFilter
from apps.recipes.models import RecipeItem 
from apps.recipes.serializers import RecipeItemSerializer

class RecipeItemViewSet(viewsets.ModelViewSet):

    serializer_class = RecipeItemSerializer
    queryset = RecipeItem.objects.all()
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filter_fields = ['timestamp', 'rating', 'title', 'has_made']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)
