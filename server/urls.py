"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from apps.accounts.urls import accounts_urlpatterns
from apps.recipes.urls import recipes_urlpatterns
from apps.scraper.urls import scraper_urlpatterns
from django.views.decorators.cache import never_cache

from .views import FrontendAppView

urlpatterns = [
    # path(r'', never_cache(FrontendAppView.as_view()), name='index'),
   path('admin/', admin.site.urls),
   path('', include('django_prometheus.urls')),
   path(r'health/', include('health_check.urls'))
]

urlpatterns += accounts_urlpatterns
urlpatterns += recipes_urlpatterns
urlpatterns += scraper_urlpatterns

urlpatterns += [
    # re_path(r"^(?:.*)?$", never_cache(FrontendAppView.as_view())),
    # path("login/", never_cache(FrontendAppView.as_view())),
    # path("activate/<uid>/<slug:token>/", never_cache(FrontendAppView.as_view())),
    # path("resend_activation/", never_cache(FrontendAppView.as_view())),
    # path("reset_password/<uid>/<slug:token>/", never_cache(FrontendAppView.as_view())),
    # path("send_reset_password/", never_cache(FrontendAppView.as_view())),
    # path("signup/", never_cache(FrontendAppView.as_view())),
    # path("catalog/", never_cache(FrontendAppView.as_view())),
    # path("catalog/recipe/<uuid:id>/", never_cache(FrontendAppView.as_view())),
    # path("catalog/recipe/<uuid:id>/edit/", never_cache(FrontendAppView.as_view())),
    path(r'', never_cache(FrontendAppView.as_view()), name='index'),
    re_path(r"^(?:.*)?$", never_cache(FrontendAppView.as_view())),
]

