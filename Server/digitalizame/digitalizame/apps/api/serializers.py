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
    icon = serializers.ReadOnlyField(source='get_category_icon', read_only=True)

    class Meta:
        model = Site
        fields = ('id', 'description', 'detail', 'latitude', 'longitude',
                  'tags', 'category', 'creator_by', 'icon')


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
        fields = ('password', 'first_name', 'last_name', 'email', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)

    def create(self, validated_data):
        user = User(first_name=validated_data['first_name'], last_name=validated_data['last_name'],
                    username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

