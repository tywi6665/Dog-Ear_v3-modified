from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class BaseTest(TestCase):
    def setUp(self):
        self.login_url=reverse('login')
        self.user={
            'email':'testemail@gmail.com',
            'username':'username',
            'password':'password',
            'password2':'password',
            'name':'fullname'
        }
        return super().setUp()
    
class LoginTest(BaseTest):
    def test_cantlogin_with_no_email(self):
        response= self.client.post(self.login_url,{'email':'', 'password':'passwped'},format='text/html')
        self.assertEqual(response.status_code,400)

    def test_cantlogin_with_no_password(self):
        response= self.client.post(self.login_url,{'email':'testemail@gmail.com','password':''},format='text/html')
        self.assertEqual(response.status_code,400)