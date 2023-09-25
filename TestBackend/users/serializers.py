from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = get_user_model()
		fields = ["id", "login", "password", "name", "lastname"]
		read_only_fields = ["id"]
		extra_kwargs = {"password": {"write_only": True}}

	def create(self, validated_data):
		user = get_user_model()(
			login=validated_data["login"],
			name=validated_data["name"],
			lastname=validated_data["lastname"],
		)
		user.set_password(validated_data["password"])
		user.save()
		return user









