from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from patient_mgmt_backend.serializers import UserLoginSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from patient_mgmt_backend.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from patient_mgmt_backend.models import User

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED) #also returned user

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  print("entered")
  renderer_classes = [UserRenderer]
  print("1")
  #permission_classes = [IsAuthenticated]
  print("2")
  def post(self, request, format=None):
    print("HERE1")
    print(request)
    serializer = UserProfileSerializer(request.data)
    print("HERE2")
    print(serializer.data)
    user = User.objects.get(id = serializer.data['id'])
    print(user.address)
    return Response({'email':user.email, 'name':user.name, 'role':user.role, 'address':user.address, 'contact':user.contact, 'vAadhar':user.vAadhar, 'healthLicense':user.healthLicense, 'description':user.description, 'location':user.location}, status=status.HTTP_200_OK)



