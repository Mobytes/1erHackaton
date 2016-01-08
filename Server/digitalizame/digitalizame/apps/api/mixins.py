from django.db import models


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
