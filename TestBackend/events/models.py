from django.db import models
from django.contrib.auth import get_user_model

class Event(models.Model):
	id = models.BigAutoField(primary_key = True, null = False, editable = False, name = "id")
	title = models.CharField(max_length=128, null=False, name="title")
	text = models.CharField(max_length=512, null=False, name="text")
	owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="owner")
	members = models.ManyToManyField(get_user_model(), related_name="members")
	add_date = models.DateTimeField(auto_now_add=True, null=False, name="add_date")


