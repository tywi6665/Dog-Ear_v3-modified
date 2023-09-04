from rest_framework import serializers
from apps.recipes.models import RecipeItem

class RecipeItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeItem
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
