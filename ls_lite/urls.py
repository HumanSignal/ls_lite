from django.urls import path, include
from rest_framework.routers import DefaultRouter

from comments import api

app_name = 'comments'
router = DefaultRouter()
router.register(r"comments", api.CommentAPI, basename="comments")
router.register(r"status", api.StatusAPI, basename="status")


urlpatterns = [
    path('api/', include((router.urls, app_name), namespace="api")),
]