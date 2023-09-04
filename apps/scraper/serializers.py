from rest_framework import serializers
from apps.scraper.models import ScrapedRecipeItem

class ScrapedRecipeItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ScrapedRecipeItem
        read_only_fields = (
            'id',
            # 'timestamp',
            'created_by',
        )
        fields = (
            'id',
            'unique_id',
            'url',
            'title',
            'author',
            'description',
            'has_made',
            'img_src',
            'notes',
            'rating',
            'tags',
            'ingredients',
            'steps',
            'timestamp',
            'created_by'
        )
