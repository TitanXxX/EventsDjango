from django.urls import path
from .views import EventsAPIView, EventsMembersAPIView


urlpatterns = [
	path("", EventsAPIView.as_view(), name = "list"),
	path("members/", EventsMembersAPIView.as_view(), name = "members"),
]


