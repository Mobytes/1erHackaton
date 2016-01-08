from django.db import models
from .mixins import TimeStampedMixin
from .middleware import get_current_user

class Category(TimeStampedMixin):
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=255)


class Picture(TimeStampedMixin):
    picture = models.ImageField(upload_to='sites/')


class Site(TimeStampedMixin):
    description = models.CharField(max_length=255)
    detail = models.TextField(blank=True, null=True)
    latitude = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    tags = models.TextField()
    category = models.ForeignKey(Category)
    user = models.ForeignKey('auth.User', default=get_current_user)
