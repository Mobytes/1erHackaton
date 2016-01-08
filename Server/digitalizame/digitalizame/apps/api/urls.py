from django.conf.urls import url, include
from rest_framework import routers
from .views import SiteViewSet, CategoryViewSet, UserView


router = routers.DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'accounts', UserView, 'list')

urlpatterns = [
    url(r'^', include(router.urls)),
]