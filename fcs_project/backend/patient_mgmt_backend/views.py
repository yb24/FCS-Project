from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from patient_mgmt_backend.serializers import UserLoginSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from patient_mgmt_backend.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from patient_mgmt_backend.models import User
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from django.db.models import Q
from dateutil import parser
import math
import requests
import random
import smtplib
import time
from django.contrib.auth.hashers import check_password
import os
from dotenv import load_dotenv
import base64
import hmac
import hashlib
import ast
import string
import secrets

from django.http import FileResponse, HttpResponse
from wsgiref.util import FileWrapper
import mimetypes

from django.core.files.storage import FileSystemStorage
import datetime
from django.utils import timezone
import logging

logging_file = os.getenv('STORAGE_PATH')+'/post_images/logfile.log'
logging.basicConfig(filename=logging_file, format='%(asctime)s %(message)s')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

load_dotenv()

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
    try:
        # logger.info("UserRegistrationView called: "+str(request.data['email']))
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #added
        otp = str(request.data['otp'])
        userEmail = request.data['email']
        otp_record = OtpTableRegistration.objects.get(userEmail=userEmail)
        if not otp_record:
            return Response(data = "OTP invalid", status=status.HTTP_400_BAD_REQUEST)
        curr_time = timezone.now()
        generated_recently = (otp_record.timeStamp > curr_time - timezone.timedelta(minutes=2))
        if otp_record.otp != otp or generated_recently == False:
            return Response("OTP invalid", status=status.HTTP_400_BAD_REQUEST)
        OtpTableRegistration.objects.filter(userEmail=userEmail).delete()
        user = serializer.save()
        token = get_tokens_for_user(user)
        userID = User.objects.filter(email=request.data['email']).values_list('id', flat=True)[0]
        wallet_data = {'userID':str(userID), 'amount':1000.0}
        walletserializer = UserWalletSerializer(data=wallet_data)
        if not walletserializer.is_valid():
            return Response("Error while insertion", status=status.HTTP_400_BAD_REQUEST)
        walletserializer.save()
        return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED) #also returned user
    except Exception as e:
        print(e)
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    try:
        # logger.info("UserLoginView called")
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
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)
class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  #permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    try:
        # logger.info("UserProfileView called")
        serializer = UserProfileSerializer(request.data)
        user = User.objects.get(id = serializer.data['id'])
        return Response({'email':user.email, 'name':user.name, 'role':user.role, 'address':user.address, 'contact':user.contact, 'vAadhar':user.vAadhar, 'healthLicense':user.healthLicense, 'description':user.description, 'location':user.location, 'status':user.status, 'image1Path':user.image1Path, 'image2Path':user.image2Path}, status=status.HTTP_200_OK)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

class UserChangePasswordView(APIView):
    def post(self, request, format=None):
        try:
            # logger.info("UserChangePasswordView called")
            # print(request.data['actualData'])
            # print(request.data['actualData']['email'])
            existing_user_record = User.objects.get(email=request.data['actualData']['email'])
            # print(existing_user_record)
            #1. check if password matches with received password 
            if not existing_user_record.check_password(request.data['actualData']['password']):
                # print("wrong password!")
                return Response(status=status.HTTP_400_BAD_REQUEST)

            existing_user_record.name = request.data['actualData']['name']
            existing_user_record.address = request.data['actualData']['address']
            existing_user_record.contact = request.data['actualData']['contact']
            existing_user_record.vAadhar = request.data['actualData']['vAadhar']
            existing_user_record.healthLicense = request.data['actualData']['healthLicense']
            existing_user_record.description = request.data['actualData']['description']
            existing_user_record.location = request.data['actualData']['location']
            existing_user_record.image1Path = request.data['actualData']['image1Path']
            existing_user_record.image2Path = request.data['actualData']['image2Path']

            existing_user_record.save(update_fields=['name', 'address', 'contact', 'vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path'])
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        except:
            return Response("Error",status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_upload_records(request):
    try:
        # logger.info("delete upload records api called")
        if "token" not in request.data or "reportID" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        authenticated, userId = verify_user(request.data["token"])
        # logger.info("by token: " + str(request.data["token"]))
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
    
        report_id = request.data["reportID"]
        UploadRecords.objects.filter(id=report_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_upload_records(request):
    try:
        # logger.info("display uploaded records api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userId = verify_user(request.data["token"])
        if not authenticated:
            return Response(data = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        note = UploadRecords.objects.filter(userID=userId)
        serializer = UploadRecordsSerializer(note, many=True)
        return Response(serializer.data)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def insert_upload_records(request):
    try:
        # logger.info("insert uploaded records api called")
        if "token" not in request.data or "docType" not in request.data or "title" not in request.data or "content" not in request.data or "image" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        role = getUserRole(userID)
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        cur_time = str(timezone.localtime())
        cur_time = cur_time.replace(' ',':')
        request.data["title"] = str(request.data["title"]) + "_" + cur_time + "_" + str(userID)
        record = dict()
        record['userID'] = userID
        if request.data['docType'] not in ["prescription", "test_result", "bill", "insurance_document", "discharge_summary"]:
            return Response("Invalid Data", status=status.HTTP_400_BAD_REQUEST)
        record['docType'] = request.data['docType'] 
        record['docLink'] = request.data["title"]
        request.data.pop('token')
        request.data.pop('docType')
        
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid() == False:
            return Response("Error while insertion (file size too big or invalid file type)", status=status.HTTP_400_BAD_REQUEST)
        posts_serializer.save()

        img = Post.objects.get(title=request.data['title'])
        file_path = os.getenv('STORAGE_PATH')+'/'+str(img.image)
        hash_file = generateDocumentHash(file_path)
        current_ipfs_list = get_ipfs()
        cid_file = uploadIPFS({'signature':hash_file})
        record['fileHash'] = str(hash_file)
        record['isVerified'] = "Yes"

        if role == 'PT':
            if cid_file not in current_ipfs_list:
                record['isVerified'] = "No"
            else:
                record_verifiability = UploadRecords.objects.filter(fileHash=str(hash_file)).values_list('isVerified', flat=True)[0]
                print("Doc verifiable: ", record_verifiability)
                if record_verifiability == "No":
                    record['isVerified'] = "No"

        serializer = UploadRecordsSerializer(data=record)
        if serializer.is_valid():   
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response("Error while insertion", status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def insert_user_table(request):
    try:
        # logger.info("insert user table api called")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def get_all_healthcare_professionals(request):
    try:
        # logger.info("get_all_healthcare_professionals api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        role = getUserRole(userID)
        if role != 'PT':
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)
        note = User.objects.filter(role='HP').values('name', 'email', 'location', 'description', 'contact', 'id')
        serializer = UserSerializer(note, many=True)
        return Response(serializer.data)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['POST'])
def get_all_pharmacy(request):
    try:
        # logger.info("get_all_pharmacy api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        role = getUserRole(userID)
        if role != 'PT':
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)
        note = User.objects.filter(role='PH').values('name', 'email', 'location', 'description', 'contact', 'id')
        serializer = UserSerializer(note, many=True)
        return Response(serializer.data)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_all_insurance_firm(request):
    try:
        # logger.info("get_all_insurance_firm api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)

        role = getUserRole(userID)
        if role != 'PT':
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)
        
        note = User.objects.filter(role='IF').values('name', 'email', 'location', 'description', 'contact', 'id')
        serializer = UserSerializer(note, many=True)
        return Response(serializer.data)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def get_all_hospital(request):
    try:
        # logger.info("get_all_hospital api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        if role != 'PT':
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)

        note = User.objects.filter(role='HS').values('name', 'email', 'location', 'description', 'contact', 'id')
        serializer = UserSerializer(note, many=True)
        return Response(serializer.data)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_curr_balance(request):
    try:
        # logger.info("get_curr_balance api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)

        role = getUserRole(userID)
        if not (role == 'PT' or role == 'IF' or role =='PH'):
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)

        balance = UserWallet.objects.filter(userID=userID).values_list('amount', flat=True)[0]
        return Response(data = balance, status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_money(request):
    try:
        logger.info("add_money api called")
        if "token" not in request.data or "amount" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        logger.info("by token: " + str(request.data["token"]) + "amount: " + str(request.data["amount"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        role = getUserRole(userID)
        if not (role == 'PT' or role == 'IF' or role =='PH'):
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)

        amount = float(request.data["amount"])
        time = UserWallet.objects.filter(userID = userID).values_list('lastAddedMoney', flat=True)[0]
        curr_time = timezone.now()
        added_recently = (time > curr_time - timezone.timedelta(minutes=10))
        if amount < 0 or amount > 1000 or added_recently:
            return Response("Input Amount Invalid or Money Added Recently", status=status.HTTP_400_BAD_REQUEST)
        wallet = UserWallet.objects.get(userID = userID)
        wallet.amount += amount
        wallet.lastAddedMoney = curr_time
        wallet.save(update_fields=['amount','lastAddedMoney'])
        # print(list(UserWallet.objects.filter(userID = userID).values('userID','amount','lastAddedMoney')))
        return Response(status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def share_document(request):
    try:
        # logger.info("share_document api called")
        if "token" not in request.data or "emailID" not in request.data or "reportID" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response(data = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        receiverEmail = request.data['emailID']
        
        receiverID = User.objects.filter(email=receiverEmail).values_list('id', flat=True)[0]
        receiverRole = getUserRole(receiverID)

        if str(userID) == str(receiverID):
            return Response("Sharing/Requesting with yourself not allowed", status=status.HTTP_400_BAD_REQUEST)

        # if role == 'PT':
        #     print("Harman Ludo")

        reportID = request.data['reportID']
        billMade = "No"
        docLink = UploadRecords.objects.filter(id=reportID).values_list('docLink', flat=True)
        docType = UploadRecords.objects.filter(id=reportID).values_list('docType', flat=True)
        isVerified = UploadRecords.objects.filter(id=reportID).values_list('isVerified', flat=True)
        fileHash = UploadRecords.objects.filter(id=reportID).values_list('fileHash', flat=True)
        to_be_inserted = {"userID":userID, "receiverEmail":receiverEmail, "reportID": reportID, "billMade":billMade, "docLink":docLink[0], "docType":docType[0],"isVerified":isVerified[0],"fileHash":fileHash[0]}
        # print(to_be_inserted)

        if "requestID" in request.data and request.data["requestID"] != "":
            updateRecord = PendingDocumentRequests.objects.get(id = request.data["requestID"])
            emailToBeSent = User.objects.filter(id=updateRecord.userID).values_list('email', flat=True)[0]
            if receiverEmail == emailToBeSent:
                updateRecord.requestCompleted = "Yes"
                updateRecord.save(update_fields=['requestCompleted'])
            else:
                return Response("Wrong recevier mail", status=status.HTTP_400_BAD_REQUEST)


        serializer = ShareRecordsSerializer(data=to_be_inserted)
        if serializer.is_valid():
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response("Error while insertion", status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def request_documents(request):
    try:
        # logger.info("request_documents api called")
        if "token" not in request.data or "docType" not in request.data or "receiverEmail" not in request.data or "date" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        if role != 'PT':
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)     

        docType = request.data['docType']
        receiverEmail = request.data['receiverEmail']

        receiverID = User.objects.filter(email=receiverEmail).values_list('id', flat=True)[0]
        receiverRole = getUserRole(receiverID)
        if str(userID) == str(receiverID):
            return Response("Sharing/Requesting with yourself not allowed", status=status.HTTP_400_BAD_REQUEST)

        if not (receiverRole == 'HP' or receiverRole == 'HS'):
            return Response("Cant request document from receiver", status=status.HTTP_400_BAD_REQUEST)

        date = request.data['date']
        date = str(parser.parse(date))
        to_be_inserted = {"userID":userID, "receiverEmail":receiverEmail, "docType": docType, "date":date, "requestCompleted":"No"}
        serializer = PendingDocumentRequestsSerializer(data=to_be_inserted)
        if serializer.is_valid():
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response("Error while insertion", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_pending_document_requests(request):
    try:
        # logger.info("display_pending_document_requests api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        if not(role == 'HS' or role == 'HP'):
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)     

        receiverEmail = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        records = list(PendingDocumentRequests.objects.filter(requestCompleted = "No", receiverEmail = receiverEmail).values('id', 'userID', 'docType', 'date'))
        
        return_records = []
        for record in list(records):
            new_rec = dict()
            new_rec['id'] = record['id']
            new_rec['name'] = User.objects.filter(id=record['userID']).values_list('name', flat=True)[0]
            new_rec['email'] = User.objects.filter(id=record['userID']).values_list('email', flat=True)[0]
            new_rec['type'] = record['docType']
            new_rec['date'] = record['date']
            return_records.append(new_rec)

        return Response(data = return_records, status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_shared_documents(request):
    try:
        # logger.info("display_shared_documents api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))

        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        user_email = User.objects.filter(id=userID).values_list('email', flat=True)
        if not user_email:
            return Response("No user found", status=status.HTTP_400_BAD_REQUEST)
        shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0]).values('id', 'userID', 'docType', 'docLink', 'billMade','isVerified','fileHash')
        return_records = []
        for records in list(shared_records_list):
            new_rec = dict()
            new_rec['id'] = records['id']
            new_rec['type'] = records['docType']
            new_rec['doc'] = records['docLink']
            new_rec['shared_by'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
            new_rec['billMade'] = records['billMade']
            new_rec['isVerified'] = records['isVerified']
            new_rec['fileHash'] = records['fileHash']
            return_records.append(new_rec) 
        return Response(data = return_records, status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_unmade_bills(request):
    try:
        # logger.info("display_unmade_bills api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response(data = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        user_email = User.objects.filter(id=userID).values_list('email', flat=True)
        role = getUserRole(userID)
        if role == "PH":
            shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0], docType = "prescription", billMade = "No").values('id', 'userID', 'docType', 'docLink', 'billMade','isVerified','fileHash')
            return_records = []
            for records in list(shared_records_list):
                new_rec = dict()
                new_rec['id'] = records['id']
                new_rec['type'] = records['docType']
                new_rec['doc'] = records['docLink']
                new_rec['sharedBy'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
                new_rec['billMade'] = records['billMade']
                new_rec['isVerified'] = records['isVerified']
                new_rec['fileHash'] = records['fileHash']
                return_records.append(new_rec) 
            return Response(data = return_records, status=status.HTTP_201_CREATED)
        elif role == "IF":
            shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0], docType__in = ["discharge_summary", "bill"], billMade = "No").values('id', 'userID', 'docType', 'docLink', 'billMade','isVerified','fileHash')
            return_records = []
            for records in list(shared_records_list):
                new_rec = dict()
                new_rec['id'] = records['id']
                new_rec['type'] = records['docType']
                new_rec['doc'] = records['docLink']
                new_rec['sharedBy'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
                new_rec['billMade'] = records['billMade']
                new_rec['isVerified'] = records['isVerified']
                new_rec['fileHash'] = records['fileHash']
                return_records.append(new_rec) 
            return Response(data = return_records, status=status.HTTP_201_CREATED)
        else:
            return Response("Incorrect Role", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def make_bill(request):
    try:
        # logger.info("make_bill api called")
        if "token" not in request.data or "amount" not in request.data or "sharedByEmail" not in request.data or "sharedRecordID" not in request.data:
            return Response("Incorrect Role", status=status.HTTP_400_BAD_REQUEST)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        role = getUserRole(userID)
        updateRecord = ShareRecords.objects.get(id = request.data['sharedRecordID'])
        updateRecord.billMade = "Yes"
        updateRecord.save(update_fields=['billMade'])
        payerID = ""
        receiverEmail = ""
        amount = float(request.data['amount'])
        payment_status = "Unpaid"
        if amount < 0 or amount > 10000:
            return Response("Bill Amount Invalid", status=status.HTTP_400_BAD_REQUEST)
        if role == 'IF':
            payerID = userID
            receiverEmail = request.data['sharedByEmail']
        elif role == 'PH':
            payerID = User.objects.filter(email=request.data['sharedByEmail']).values_list('id', flat=True)[0]
            receiverEmail = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        else:
            return Response("Incorrect Role", status=status.HTTP_400_BAD_REQUEST)
        record = {"payerID":str(payerID), "receiverEmail":receiverEmail, "status":payment_status, "amount":amount}
        serializer = PaymentRecordsSerializer(data=record)
        if serializer.is_valid():
            serializer.save()
            return Response(data = "Success")
        print(serializer.errors)
        return Response("Error while insertion", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_payments_to_be_made(request):
    try:
        # logger.info("display_payments_to_be_made api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response(data = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        records = list(PaymentRecords.objects.filter(status = "Unpaid", payerID = userID).values('id', 'receiverEmail', 'amount','status'))
        return Response(data = records, status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def make_payment(request):
    # check 
    #   if OTP exists for the UserID. IF NO, return fail.
    #           Check if otp supplied matches in OtpTable. 
    #                   If no, return failure, 
    #                   If yes, check if otp timestamp within 120 sec. 
    #                       If No return fail.
    #   Else delete the otp entry from OtpTable. 
    try:
        logger.info("make_payment api called")
        if "token" not in request.data or "otp" not in request.data or "paymentID" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        otp = str(request.data['otp'])
        otp_record = OtpTable.objects.get(userID=userID)
        if not otp_record:
            return Response("OTP invalid", status=status.HTTP_400_BAD_REQUEST)
        curr_time = timezone.now()
        generated_recently = (otp_record.timeStamp > curr_time - timezone.timedelta(minutes=2))
        if otp_record.otp != otp or generated_recently == False:
            return Response("OTP invalid", status=status.HTTP_400_BAD_REQUEST)
        OtpTable.objects.filter(userID=userID).delete()
        userwallet = UserWallet.objects.get(userID=userID)
        payment = PaymentRecords.objects.get(id = request.data['paymentID'])
        logger.info("Payment: " + str(payment.amount))
        if payment.amount > userwallet.amount:
            return Response("Wallet has insufficient money", status=status.HTTP_400_BAD_REQUEST)
        payment.status = "Paid"
        payment.save(update_fields=['status'])
        userwallet.amount -= payment.amount
        userwallet.save(update_fields=['amount'])
        receiverID = User.objects.filter(email=payment.receiverEmail).values_list('id', flat=True)[0]
        receiverwallet = UserWallet.objects.get(userID=receiverID)
        receiverwallet.amount += payment.amount
        receiverwallet.save(update_fields=['amount'])
        return Response(data = "Success")
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_all_payment_records(request):
    try:
        # logger.info("display_all_payment_records api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        if not (role == 'PT' or role == 'PH' or role == 'IF'):
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)     

        receiverEmail = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        payment_records = list(PaymentRecords.objects.filter(Q(payerID = userID) | Q(receiverEmail = receiverEmail)).values('id', 'payerID', 'receiverEmail', 'amount','status'))
        return_records = []
        for records in payment_records:
            new_rec = dict()
            new_rec['id'] = records['id']
            new_rec['payerEmail'] = User.objects.filter(id=records['payerID']).values_list('email', flat=True)[0]
            new_rec['receiverEmail'] = records['receiverEmail']
            new_rec['amount'] = records['amount']
            new_rec['status'] = records['status']
            return_records.append(new_rec) 
        return Response(data = return_records, status=status.HTTP_201_CREATED)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def generate_otp(request):
    try:
        # logger.info("generate_otp api called")
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        
        role = getUserRole(userID)
        if not (role == 'PT' or role == 'IF'):
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)     

        receiverEmail = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        digits = string.digits + string.ascii_uppercase
        OTP = ""
        for i in range(8):
            OTP += digits[secrets.randbelow(36)]
        otp = OTP + " is your OTP"
        msg = 'Subject: {}\n\n{}'.format("Generated OTP for payment: ", otp)

        s = smtplib.SMTP("smtp.gmail.com", 587)
        s.starttls()
        
        s.login("otp123authenticator@gmail.com", os.getenv('EMAIL_PWD'))
        record = {'userID': userID, 'otp': OTP, 'timeStamp': timezone.now()}
        try:
            existing_otp_record = OtpTable.objects.get(userID=userID)
            print("current timeStamp: ", existing_otp_record.timeStamp, type(existing_otp_record.timeStamp))
            curr_time = timezone.now()
            generated_recently = (existing_otp_record.timeStamp > curr_time - timezone.timedelta(minutes=2))
            if generated_recently:
                return Response("Otp generated recently", status=status.HTTP_400_BAD_REQUEST)
            existing_otp_record.otp = OTP
            existing_otp_record.timeStamp = curr_time
            existing_otp_record.save(update_fields=['otp', 'timeStamp'])
            s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        except:
            serializer = OtpTableSerializer(data=record)
            if serializer.is_valid():
                serializer.save()
                s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
                return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def generate_otp_registration(request):
    try:
        # logger.info("generate_otp_registration api called")
        if "userEmail" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        
        receiverEmail = request.data['userEmail']
        digits = string.digits + string.ascii_uppercase
        OTP = ""
        for i in range(8):
            OTP += digits[secrets.randbelow(36)]
        otp = OTP + " is your OTP"
        msg = 'Subject: {}\n\n{}'.format("Generated OTP for registration:", otp)

        s = smtplib.SMTP("smtp.gmail.com", 587)
        s.starttls()
        s.login("otp123authenticator@gmail.com", os.getenv('EMAIL_PWD'))
        record = {'userEmail': request.data['userEmail'], 'otp': OTP, 'timeStamp': timezone.now()}
        try:
            existing_otp_record = OtpTableRegistration.objects.get(userEmail=request.data['userEmail'])
            curr_time = timezone.now()
            generated_recently = (existing_otp_record.timeStamp > curr_time - timezone.timedelta(minutes=2))
            if generated_recently:
                return Response("Otp generated recently", status=status.HTTP_400_BAD_REQUEST)
            
            existing_otp_record.otp = OTP
            existing_otp_record.timeStamp = curr_time
            existing_otp_record.save(update_fields=['otp', 'timeStamp'])
            s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
            return Response(data = "Success", status=status.HTTP_201_CREATED)
        except:
            serializer = OtpTableRegistrationSerializer(data=record)
            if serializer.is_valid():
                serializer.save()
                s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
                return Response(data = "Success", status=status.HTTP_201_CREATED)
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

def verify_user(token):
    try:
        secret = bytes(os.getenv('SECRET_KEY'), "latin1")
        split_token = token.split(".")
        encoded_header = split_token[0]
        encoded_payload = split_token[1]
        encoded_signature = split_token[2]

        # Validating token's signature against supplied secret
        msg = bytes(encoded_header + "." + encoded_payload, "latin1")
        calculated_signature_1 = hmac.new(secret, msg, hashlib.sha256).digest()
        encoded_calculated_signature = str(base64.urlsafe_b64encode(calculated_signature_1), "latin1").rstrip("=")
        payload = ast.literal_eval(str(base64.urlsafe_b64decode(encoded_payload + "==="), "latin1"))
        if encoded_calculated_signature == encoded_signature:
            return True, payload['user_id']
        return False, -1
    except:
        return False, -1


@api_view(['POST'])
def get_role(request):
    try:
        if "token" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        role = getUserRole(userID)
        email = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        userStatus = User.objects.filter(id=userID).values_list('status', flat=True)[0]
        return Response({'role':role, 'email':email, 'userStatus':userStatus}, status=status.HTTP_200_OK)
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_file(request):
    try:
        # logger.info("get_file api called")
        if "token" not in request.data or "file" not in request.data:
            return Response("Missing Parameters", status=status.HTTP_404_NOT_FOUND)
        # logger.info("by token: " + str(request.data["token"]))
        authenticated, userID = verify_user(request.data["token"])
        if not authenticated:
            return Response("Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
        realUser = str(request.data['file'].split('_')[-1])
        user_mail = User.objects.filter(id=userID).values_list('email', flat=True)[0]
        all_receiver_mails = list(ShareRecords.objects.filter(docLink = request.data['file']).values_list('receiverEmail', flat = True))
        authorized = (str(realUser) == str(userID)) or (user_mail in all_receiver_mails)
        if not authorized:
            return Response("Unauthorized Access", status=status.HTTP_400_BAD_REQUEST)
        img = Post.objects.get(title=request.data['file'])
        print("Image: ", str(img.image))
        file_path = os.getenv('STORAGE_PATH')+'/'+str(img.image)
        wrapper = FileWrapper(open(file_path, 'rb'))
        content_type = mimetypes.guess_type(str(img.image))[0]  # Use mimetypes to get file type
        response = HttpResponse(wrapper,content_type=content_type)  
        response['Content-Length'] = os.path.getsize(file_path)    
        response['Content-Disposition'] = "attachment; filename=%s" %  img.title
        return response
    except:
        return Response("Error",status=status.HTTP_400_BAD_REQUEST)



def getUserRole(userID):
    userRole = User.objects.filter(id=userID).values_list('role', flat=True)[0]
    return userRole

def uploadIPFS(data):
    headers = {
        'pinata_api_key':os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_API_SECRET')
    }
    response = requests.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", headers=headers, data=data)
    if response.status_code != 200:
        return None
    return response.json()['IpfsHash']

def check_ipfs(data):
    headers = {
        'pinata_api_key':os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_API_SECRET')
    }
    response = requests.get("https://api.pinata.cloud/data/pinList?status=pinned", headers=headers)
    documents = response.json()['rows']
    print("ipfs documents: ", documents)
    ipfs_hash_list = [str(doc['ipfs_pin_hash']) for doc in documents]
    if data in ipfs_hash_list:
        return True
    return False

def get_ipfs():
    headers = {
        'pinata_api_key':os.getenv('PINATA_API_KEY'),
        'pinata_secret_api_key': os.getenv('PINATA_API_SECRET')
    }
    response = requests.get("https://api.pinata.cloud/data/pinList?status=pinned", headers=headers)
    documents = response.json()['rows']
    ipfs_hash_list = [str(doc['ipfs_pin_hash']) for doc in documents]
    return ipfs_hash_list

def generateDocumentHash(path):
    buffer_size = 65536
    sha256 = hashlib.sha256()
    with open(path,'rb') as f:
        while True:
            data = f.read(buffer_size)
            if not data:
                break
            sha256.update(data)
    sha256Hash = sha256.hexdigest()
    return str(sha256Hash)
    

    
