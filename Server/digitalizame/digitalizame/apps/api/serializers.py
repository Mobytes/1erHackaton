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
