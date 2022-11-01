from rest_framework import serializers
from patient_mgmt_backend.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from patient_mgmt_backend.utils import Util
from .models import *

class UserRegistrationSerializer(serializers.ModelSerializer):
  # We are writing this becoz we need confirm password field in our Registratin Request
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = User
    fields=['email', 'name', 'password', 'password2', 'tc', 'role', 'address', 'contact', 'vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path', 'status']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id']

  def getProfile(self, email):
    return User.objects.get(email_exact = email)

#added
class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = ['id', 'name', 'detail'] 

class UploadRecordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadRecords
        fields = ['id','userID','docLink','docType']

class ShareRecordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareRecords
        fields = ['id', 'userID','receiverID','docLink','docType']

class PaymentRecordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecords
        fields = ['id','userID','receiverID','amount','status','Type']

class UserTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTable
        fields = ['id','email','name','role','address','contact','vAadhar','healthLicense','description','location','image1Path','image2Path','status']
