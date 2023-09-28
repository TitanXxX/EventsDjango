from django.http import HttpResponse
from django.template import loader

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Event
from .serializers import EventSerializer

class EventsAPIView(APIView):
	permission_classes = [IsAuthenticated]
	authentication_classes = (TokenAuthentication,)

	def get(self, request):
		data = Event.objects.all()
		return Response({"error": None , "result": EventSerializer(data, many=True).data})

	def post(self, request):
		output = {"error": None, "result": None}
		serializer = EventSerializer(data = request.data)
		if(not serializer.is_valid(raise_exception=False)):
			output["error"] = serializer.errors
			return Response(output)
		serializer.save(owner = request.user)
		output["result"] = serializer.data
		return Response(output)

	def delete(self, request):
		output = {"error": None, "result": None}
		id = request.data.get("id")
		if(id):
			try:
				event = Event.objects.filter(id=id)
				if(event):
					event = event.first()
					if(event.owner == request.user):
						event.delete()
						output["result"] = "Success"
					else:
						output["error"] = "You are not owner of this event"
				else:
					output["error"] = "Event with this id not found"
			except Exception as e:
				output["error"] = str(e)
		else:
			output["error"] = "'id' not found"
		return Response(output)

class EventsMembersAPIView(APIView):
	permission_classes = [IsAuthenticated]
	authentication_classes = (TokenAuthentication,)

	def post(self, request):
		output = {"error": None, "result": None}
		id = request.data.get("id")
		if(id):
			event = Event.objects.filter(id=id)
			if(event):
				event = event.first()
				if(not event.members.filter(id=request.user.id).exists()):
					event.members.add(request.user)
					output["result"] = "Success"
				else:
					output["error"] = "You already member of this event"
			else:
				output["error"] = "Event with this id not found"
		else:
			output["error"] = "'id' not found"
		return Response(output)

	def delete(self, request):
		output = {"error": None, "result": None}
		id = request.data.get("id")
		if(id):
			event = Event.objects.filter(id=id)
			if(event):
				event = event.first()
				if(event.members.filter(id=request.user.id).exists()):
					event.members.remove(request.user)
					output["result"] = "Success"
				else:
					output["error"] = "You are not member of this event"
			else:
				output["error"] = "Event with this id not found"
		else:
			output["error"] = "'id' not found"
		return Response(output)


def index(request):
	template = loader.get_template("events.html")
	return HttpResponse(template.render({},request))
