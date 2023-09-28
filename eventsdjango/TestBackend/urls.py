"""
URL configuration for Events project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from django.views.static import serve
from django.contrib import admin
from django.conf import settings

from events.views import index

from users.views import login, details

urlpatterns = [
	path("admin/", admin.site.urls),
	path("api/v0/events/", include(("events.urls", "events"), namespace="events")),
	path("api/v0/users/", include(("users.urls", "users"), namespace="users")),
	path("", index, name="index"),
	path("signup", index, name="signup"),
	path("login", login, name="login"),
	path("detailsweb/<int:id>/", details, name="detailsweb"),
	re_path(r"^static/(?P<path>.*)$", serve,{"document_root": settings.STATIC_ROOT}),
]



