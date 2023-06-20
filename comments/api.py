import logging
from rest_framework import viewsets
from comments.serializers import CommentSerializer, PhotoSerializer
from comments.models import Comment, Photo
from django.http import JsonResponse
from comments.functions import start_job, hello_func

logger = logging.getLogger(__name__)


class CommentAPI(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class PhotoAPI(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer


class StatusAPI(viewsets.ViewSet):

    def list(self, request):
        start_job(hello_func)

        return JsonResponse({'Hello': 'world'})
