from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager

class User(AbstractUser):
	id = models.BigAutoField(primary_key = True, null = False, editable = False, name = "id")
	login = models.CharField(max_length = 128, null = False, name = "login", unique=True)
	password = models.CharField(max_length = 256, null = False, name = "password")
	name = models.CharField(max_length = 64, null = False, name = "name")
	lastname = models.CharField(max_length = 64, null = False, name = "lastname")
	birth_date = models.DateField(null = True, name = "birth_date")
	
	email = None
	username = None
	last_login = None

	USERNAME_FIELD = "login"
	REQUIRED_FIELDS = ["name", "lastname"]

	objects = CustomUserManager()

	def __str__(self):
		return self.login


