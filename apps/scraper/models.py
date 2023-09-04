from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class ScrapedRecipeItem(models.Model):
    unique_id = models.UUIDField(default="", unique=True)
    url = models.URLField(max_length=300, default="", blank=True)
    title = models.CharField(max_length=100, default="")
    author = models.CharField(max_length=100, default="", blank=True)
    description = models.TextField(max_length=None, default="", blank=True)
    img_src = models.URLField(max_length=300, default="", blank=True)
    has_made = models.BooleanField(default=False)
    notes = models.JSONField(default=list)
    rating = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    ingredients = models.TextField(max_length=None, default="", blank=True)
    steps = models.TextField(max_length=None, default="", blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.unique_id)
    
     # This is for basic and custom serialization to return it to client as a JSON.
    @property
    def to_dict(self):
        data = {
            'unique_id': self.unique_id,
            'url': self.url,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'has_made': self.has_made,
            'img_src': self.img_src,
            'notes': self.notes,
            'rating': self.rating,
            'tags': self.tags,
            'ingredients': self.ingredients,
            'steps': self.steps,
            'timestamp': self.timestamp
        }
        return data 