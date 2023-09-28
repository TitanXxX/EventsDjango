from rest_framework import serializers
from .models import Event
#from users.models import CustomUser



class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = ["id", "title", "text", "add_date", "owner", "members"]
		read_only_fields = ["id", "add_date", "owner", "members"]
	
	def create(self, validated_data):
		return Event.objects.create(**validated_data)



