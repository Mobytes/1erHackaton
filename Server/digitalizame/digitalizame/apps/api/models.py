from django.db import models
from .mixins import TimeStampedMixin
from django.contrib.auth.models import User


class Category(TimeStampedMixin):
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=255)

    def __str__(self):
        return self.description


class Site(TimeStampedMixin):
    user = models.ManyToManyField(User, through='Rating', related_name="ratings")
    user_like = models.ManyToManyField(User, through='Like')
    description = models.CharField(max_length=255)
    detail = models.TextField(blank=True, null=True)
    latitude = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    tags = models.TextField()
    category = models.ForeignKey(Category)
    creator_by = models.ForeignKey(User, related_name="creator")

    def get_category_icon(self):
        return Category.objects.get(pk=self.category.id).icon


class Picture(TimeStampedMixin):
    picture = models.ImageField(upload_to='sites/')
    site = models.ForeignKey(Site)


class Rating(TimeStampedMixin):
    user = models.ForeignKey(User)
    site = models.ForeignKey(Site)
    rating = models.DecimalField(max_digits=2, decimal_places=1)


class Like(TimeStampedMixin):
    user = models.ForeignKey(User)
    site = models.ForeignKey(Site)
