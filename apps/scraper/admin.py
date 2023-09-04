from django.contrib import admin
from .models import ScrapedRecipeItem
    
class ScrapedRecipeItemAdmin(admin.ModelAdmin):
    list_display = (
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
        )

# Register your models here.
admin.site.register(ScrapedRecipeItem, ScrapedRecipeItemAdmin)