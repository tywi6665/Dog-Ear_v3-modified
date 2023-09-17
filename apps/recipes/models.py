from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class RecipeItem(models.Model):
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
    ingredients = models.TextField(max_length=None, default='[{"header":"","content":[]}]', blank=True)
    steps = models.TextField(max_length=None, default='[{"header":"","content":[]}]', blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, default="himynameisjs", on_delete=models.CASCADE)