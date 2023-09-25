import json
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import status

from .serializers import UserSerializer
from django.contrib.auth import get_user_model

from django.http import HttpResponse
from django.template import loader


# Class based view to Get user Details using Token Authentication
class UserDetailAPI(APIView):
	permission_classes = [IsAuthenticated]
	authentication_classes = (TokenAuthentication,)
	def post(self, request, *args, **kwargs):
		output = {"error": None, "result": None}
		id = request.data.get("id")
		if(id):
			user = get_user_model().objects.filter(id=id)
			if(user):
				serializer = UserSerializer(user.first())
				output["result"] = serializer.data
			else:
				output["error"] = "User with this id not found"
		else:
			user = get_user_model().objects.all()
			serializer = UserSerializer(user, many=True)
			output["result"] = serializer.data
		return Response(output)
		

class UserAPI(APIView):
	#permission_classes = [IsAuthenticated]
	#permission_classes = [AllowAny]
	#authentication_classes = (TokenAuthentication,)
	
	def post(self, request, *args, **kwargs):
		serializer = UserSerializer(data = request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({"error": None, "result": serializer.data}, status=status.HTTP_201_CREATED)
		return Response({"error": serializer.errors, "result": None}, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request, *args, **kwargs):
		if(not request.user.is_authenticated):
			return Response({"error": "User not authorized", "result": None}, status=status.HTTP_401_UNAUTHORIZED)
		try:
			request.user.delete()
			return Response({"error": None, "result": "Successfully deleted."}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"error": str(e), "result": None}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
class UserAuthAPI(APIView):
	permission_classes = []
	
	def post(self, request, *args, **kwargs):
		if(not request.user.is_authenticated):
			login = request.data.get('login')
			password = request.data.get('password')
			users = get_user_model().objects.filter(login=login)
			if(users):
				user = users.first()
				if(user.check_password(password)):
					token, _ = Token.objects.get_or_create(user=user)
					request.user = user
					serializer = UserSerializer(user)
					return Response({"error": None, "result": {"token": token.key, "user": serializer.data}}, status=status.HTTP_200_OK)
			return Response({"error": "Invalid credentials", "result": None}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			return Response({"error": None, "result": {"token": Token.objects.get(user=request.user).key, "user": UserSerializer(request.user).data}}, status=status.HTTP_200_OK)

	def delete(self, request, *args, **kwargs):
		if(not request.user.is_authenticated):
			return Response({"error": "user not authorized", "result": None}, status=status.HTTP_401_UNAUTHORIZED)
		try:
			request.user.auth_token.delete()
			return Response({"error": None, "result": "Successfully logged out."}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"error": str(e), "result": None}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def login(request):
	template = loader.get_template("user_action.html")
	return HttpResponse(template.render({}, request))

def details(request, id):
	template = loader.get_template("user_details.html")
	UserSerializer()
	user = get_user_model().objects.filter(id=id)
	if(user):
		serializer = UserSerializer(user.first())
		return HttpResponse(template.render(serializer.data, request), status=200)
	else:
		return HttpResponse(template.render({}, request), status=404)

