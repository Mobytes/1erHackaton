from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Rating, Site, Picture, Like, Category


class CategorySerialier(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'description', 'icon')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'user', 'site')


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('description', 'detail', 'latitude', 'longitude', 'tags', 'category')


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ('picture', 'site')


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('user', 'site')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password', 'first_name', 'last_name', 'email',)
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)

    def restore_object(self, attrs, instance=None):
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user
