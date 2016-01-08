from django.db import IntegrityError, transaction
from django.core.files import File
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from .mixins import DefaultViewSetMixin
from .models import Site, Category
from .serializers import SiteSerializer, CategorySerialier, UserSerializer, PictureSerializer
from .permissions import IsStaffOrTargetUser



class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    model = User

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),


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
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():

                serializer_site = SiteSerializer(data=request.data)
                serializer_site.is_valid(raise_exception=True)
                serializer_site.save()

                picture = File(request.data['picture'])

                picture = {'picture': picture, 'site': serializer_site.data['id']}
                serializer_picture = PictureSerializer(data=picture)
                serializer_picture.is_valid(raise_exception=True)
                serializer_picture.save()

                return Response({'status': "Ok"}, status=status.HTTP_200_OK)

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


class AuthView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data['username']
        password = request.data['password']
        if username is not None and password is not None:
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    token, created = Token.objects.get_or_create(user=user)
                    print(token)
                    response = {
                        'token': str(token),
                        'username': user.username,
                        'id': user.id
                    }
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid User'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid Username/Password'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
