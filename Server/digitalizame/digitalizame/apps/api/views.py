from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets, status
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

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                print(request.data)
                return Response({}, status=status.HTTP_200_OK)

        except IntegrityError as e:
            error = {
                "result": "Error",
                "message": str(e)
            }

        except ValidationError as e:
            error = {
                "result": "Error",
                "message": str(e)
            }

        return Response(error, status=status.HTTP_400_BAD_REQUEST)
