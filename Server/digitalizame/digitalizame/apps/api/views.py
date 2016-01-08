from rest_framework import viewsets
from .mixins import DefaultViewSetMixin
from .models import Site
from .serializers import SiteSerializer


class SiteViewSet(DefaultViewSetMixin, viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    search_fields = ('description', 'tags', 'category', 'creator_by')
    ordering_fields = '__all__'
