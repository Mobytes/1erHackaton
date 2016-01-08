from django.conf.urls import url, include
from rest_framework import routers
from .views import SiteViewSet, CategoryViewSet, UserView, AuthView


router = routers.DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'accounts', UserView, 'list')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^login', AuthView.as_view()),
    # url(r'^sites/$', SiteViewSet.as_view()),
    # url(r'^sites/(?P<pk>[0-9]+)/$', SiteViewSet.as_view()),
]