from django.urls import path
from .views import UserAuthAPI, UserAPI, UserDetailAPI

urlpatterns = [
	path("auth/", UserAuthAPI.as_view(), name="auth"),
	path("", UserAPI.as_view(), name="action"),
	path("details/", UserDetailAPI.as_view(), name="details"),
]


