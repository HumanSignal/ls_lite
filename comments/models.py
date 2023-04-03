from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class Comment(models.Model):
    """Comments about annotations"""

    text = models.TextField(
        _('text'),
        blank=True,
        null=True,
        default='',
        help_text='Reviewer or annotator comment',
    )

    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
        help_text='Creation time',
    )

    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
        help_text='Last updated time'
    )

    is_resolved = models.BooleanField(
        _('is_resolved'),
        default=False,
        help_text='True if the comment is resolved'
    )
    resolved_at = models.DateTimeField(
        _('resolved at'),
        null=True, default=None,
        help_text='Resolving time',
    )
