from django.db import models
from rest_framework import authentication, permissions, filters


class ManagerMainMixin(models.Manager):
    def get_queryset(self):
        return super(ManagerMainMixin, self).get_queryset().filter(deleted_at__isnull=True)


class TimeStampedMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    objects = ManagerMainMixin()

    class Meta:
        abstract = True


class DefaultViewSetMixin(object):
    # authentication_classes= (
    #     authentication.BaseAuthentication,
    #     authentication.TokenAuthentication,
    # )
    # permissions_classes = (
    #     permissions.IsAuthenticated,
    # )
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter,)
    paginate_by = 25
    paginate_by_param = 'page_size'
    max_paginate_by = 100