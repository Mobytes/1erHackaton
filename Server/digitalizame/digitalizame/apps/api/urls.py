from django.conf.urls import url, include
from rest_framework import routers
from .views import SiteViewSet


router = routers.DefaultRouter()
router.register(r'sites', SiteViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]