from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model
from django_prometheus.models import ExportModelOperationsMixin

User = get_user_model()


class RecipeItem(ExportModelOperationsMixin("RecipeItem"), models.Model):
    unique_id = models.UUIDField(default="", unique=True)
    url = models.URLField(max_length=1000, default="", blank=True)
    title = models.CharField(max_length=1000, default="")
    author = models.CharField(max_length=300, default="", blank=True)
    description = models.TextField(max_length=None, default="", blank=True)
    img_src = models.URLField(max_length=1000, default="", blank=True)
    has_made = models.BooleanField(default=False)
    notes = models.JSONField(default=list)
    rating = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    # OLD - default='[{"header":"","content":[]}]'
    ingredients = models.TextField(max_length=None, default="[]", blank=True)
    # OLD - default='[{"header":"","content":[]}]'
    steps = models.TextField(max_length=None, default="[]", blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
