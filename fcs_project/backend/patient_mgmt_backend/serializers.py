from rest_framework import serializers
from .models import *
  
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
        