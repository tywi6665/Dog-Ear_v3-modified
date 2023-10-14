from django.test import TestCase
from apps.recipes.models import RecipeItem

# Create your tests here.
class RecipeItemModelTest(TestCase):

    def test_title_representation(self):
        recipe = RecipeItem(title="title")
        self.assertEqual(str(recipe), recipe.title)
