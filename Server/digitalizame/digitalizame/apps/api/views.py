from rest_framework import viewsets
from .mixins import DefaultViewSetMixin
from .models import Site, Category
from .serializers import SiteSerializer, CategorySerialier


class CategoryViewSet(DefaultViewSetMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('description')
    serializer_class = CategorySerialier
    search_fields = ('description', 'icon')
    ordering_fields = '__all__'


class SiteViewSet(DefaultViewSetMixin, viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    search_fields = ('description', 'tags', 'category', 'creator_by')
    ordering_fields = '__all__'
