import logging
from rest_framework import viewsets
from comments.serializers import CommentSerializer
from comments.models import Comment


logger = logging.getLogger(__name__)


class CommentAPI(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
