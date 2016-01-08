from django.conf.urls import url, include
from rest_framework import routers
from .views import SiteViewSet, CategoryViewSet


router = routers.DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]