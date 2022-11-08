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
import math
import random
import smtplib
import time
from django.contrib.auth.hashers import check_password

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
    #added
    otp = str(request.data['otp'])
    userEmail = request.data['email']
    otp_record = OtpTableRegistration.objects.get(userEmail=userEmail)
    if not otp_record:
        print("here1")
        return Response(data = "OTP invalid", status=status.HTTP_400_BAD_REQUEST)
    OtpTableRegistration.objects.filter(userEmail=userEmail).delete()
    if otp_record.otp != otp or float(otp_record.timeStamp) < time.time() - 120:
        print("here2")
        print(otp_record.otp != otp)
        print(otp)
        print(otp_record.otp)
        return Response(data = "OTP invalid", status=status.HTTP_400_BAD_REQUEST)

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
    return Response({'email':user.email, 'name':user.name, 'role':user.role, 'address':user.address, 'contact':user.contact, 'vAadhar':user.vAadhar, 'healthLicense':user.healthLicense, 'description':user.description, 'location':user.location, 'status':user.status, 'image1Path':user.image1Path, 'image2Path':user.image2Path}, status=status.HTTP_200_OK)


class UserChangePasswordView(APIView):
    def post(self, request, format=None):
        print(request.data['actualData'])
        print(request.data['actualData']['email'])
        existing_user_record = User.objects.get(email=request.data['actualData']['email'])
        print(existing_user_record)
        #1. check if password matches with received password 
        if not existing_user_record.check_password(request.data['actualData']['password']):
            print("wrong password!")
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

#added
@api_view(['GET', 'POST'])
def note(request):
    if request.method == 'GET':
        note = React.objects.all()
        serializer = ReactSerializer(note, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReactSerializer(data=request.data)
        print(request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def note_detail(request, pk):
    try:
        note = React.objects.get(pk=pk)
    except React.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def delete_upload_records(request):
    if not verify_user(request.data["token"]):
        return Response(detail = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
    try:
        print(request.data)
        report_id = request.data["reportID"]
        print(report_id)
        UploadRecords.objects.filter(id=report_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except UploadRecords.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def display_upload_records(request):
    note = UploadRecords.objects.filter(userID=request.data["userID"])
    serializer = UploadRecordsSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def insert_upload_records(request):
    # if not verify_user(request.data["token"]):
    #     return Response(detail = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
    
    # print(dict(request.data))
    # print(request.data['docType'])
    serializer = UploadRecordsSerializer(data=request.data)
    if serializer.is_valid():
        print('isValid')
        serializer.save()
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    else:
        print('notValid')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def insert_user_table(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_unmade_pharmacy_bills(request):
    # filter by document type and then filter only unmade bills
    # Tables involved: uploadRecords, PaymentRecords
    return "success"

@api_view(['POST'])
def display_unmade_insurance_firm_bills(request):
    # filter by document type and then filter only unmade bills
    return "success"

@api_view(['GET'])
def display_user_table(request):
    note = User.objects.all()
    serializer = UserSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_healthcare_professionals(request):
    note = User.objects.filter(role='HP').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserSerializer(note, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_all_pharmacy(request):
    note = User.objects.filter(role='PH').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_insurance_firm(request):
    note = User.objects.filter(role='IF').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserSerializer(note, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_hospital(request):
    note = User.objects.filter(role='HS').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def share_document(request):
    userID = request.data['userID']
    receiverEmail = request.data['emailID']
    reportID = request.data['reportID']
    billMade = "No"
    docLink = UploadRecords.objects.filter(id=reportID).values_list('docLink', flat=True)
    docType = UploadRecords.objects.filter(id=reportID).values_list('docType', flat=True)
    to_be_inserted = {"userID":userID, "receiverEmail":receiverEmail, "reportID": reportID, "billMade":billMade, "docLink":docLink[0], "docType":docType[0]}
    print(to_be_inserted)
    serializer = ShareRecordsSerializer(data=to_be_inserted)
    if serializer.is_valid():
        serializer.save()
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def display_shared_documents(request):
    print(request.data)
    userID = request.data['userID']
    user_email = User.objects.filter(id=userID).values_list('email', flat=True)
    if not user_email:
        return Response(data = "No user found", status=status.HTTP_400_BAD_REQUEST)
    shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0]).values('id', 'userID', 'docType', 'docLink', 'billMade')
    print(list(shared_records_list))
    return_records = []
    for records in list(shared_records_list):
        new_rec = dict()
        new_rec['id'] = records['id']
        new_rec['type'] = records['docType']
        new_rec['doc'] = records['docLink']
        new_rec['shared_by'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
        new_rec['billMade'] = records['billMade']
        return_records.append(new_rec) 
    return Response(data = return_records, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def display_unmade_bills(request):
    user_email = User.objects.filter(id=request.data['userID']).values_list('email', flat=True)
    if request.data['role'] == "PH":
        shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0], docType = "prescription", billMade = "No").values('id', 'userID', 'docType', 'docLink', 'billMade')
        return_records = []
        for records in list(shared_records_list):
            new_rec = dict()
            new_rec['id'] = records['id']
            new_rec['type'] = records['docType']
            new_rec['doc'] = records['docLink']
            new_rec['sharedBy'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
            new_rec['billMade'] = records['billMade']
            return_records.append(new_rec) 
        return Response(data = return_records, status=status.HTTP_201_CREATED)
    elif request.data['role'] == "IF":
        shared_records_list = ShareRecords.objects.filter(receiverEmail = user_email[0], docType__in = ["discharge_summary", "bill"], billMade = "No").values('id', 'userID', 'docType', 'docLink', 'billMade')
        return_records = []
        for records in list(shared_records_list):
            new_rec = dict()
            new_rec['id'] = records['id']
            new_rec['type'] = records['docType']
            new_rec['doc'] = records['docLink']
            new_rec['sharedBy'] = User.objects.filter(id=records['userID']).values_list('email', flat=True)[0]
            new_rec['billMade'] = records['billMade']
            return_records.append(new_rec) 
        return Response(data = return_records, status=status.HTTP_201_CREATED)
    else:
        return Response(data = "Incorrect Role", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def make_bill(request):
    updateRecord = ShareRecords.objects.get(id = request.data['sharedRecordID'])
    updateRecord.billMade = "Yes"
    updateRecord.save(update_fields=['billMade'])
    payerID = ""
    receiverEmail = ""
    amount = request.data['amount']
    status = "Unpaid"
    if request.data['role'] == 'IF':
        payerID = request.data['userID']
        receiverEmail = request.data['sharedByEmail']
    elif request.data['role'] == 'PH':
        payerID = User.objects.filter(email=request.data['sharedByEmail']).values_list('id', flat=True)[0]
        receiverEmail = User.objects.filter(id=request.data['userID']).values_list('email', flat=True)[0]
    else:
        return Response(data = "Incorrect Role", status=status.HTTP_400_BAD_REQUEST)
    record = {"payerID":payerID, "receiverEmail":receiverEmail, "status":status, "amount":amount}
    serializer = PaymentRecordsSerializer(data=record)
    if serializer.is_valid():
        serializer.save()
        return Response(data = "Success")


@api_view(['POST'])
def display_payments_to_be_made(request):
    records = list(PaymentRecords.objects.filter(status = "Unpaid", payerID = request.data["userID"]).values('id', 'receiverEmail', 'amount','status'))
    return Response(data = records, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def make_payment(request):
    # check 
    #   if OTP exists for the UserID. IF NO, return fail.
    #           Check if otp supplied matches in OtpTable. 
    #                   If no, return failure, 
    #                   If yes, check if otp timestamp within 120 sec. 
    #                       If No return fail.
    #   Else delete the otp entry from OtpTable. 
    otp = str(request.data['otp'])
    userID = request.data['userID']
    otp_record = OtpTable.objects.get(userID=userID)
    if not otp_record:
        return Response(data = "OTP invalid", status=status.HTTP_400_BAD_REQUEST)
    OtpTable.objects.filter(userID=userID).delete()
    if otp_record.otp != otp or float(otp_record.timeStamp) < time.time() - 120:
        return Response(data = "OTP invalid", status=status.HTTP_400_BAD_REQUEST)
    payment = PaymentRecords.objects.get(id = request.data['paymentID'])
    payment.status = "Paid"
    payment.save(update_fields=['status'])
    return Response(data = "Success")

@api_view(['POST'])
def display_all_payment_records(request):
    receiverEmail = User.objects.filter(id=request.data['userID']).values_list('email', flat=True)[0]
    print(receiverEmail)
    payment_records = list(PaymentRecords.objects.filter(Q(payerID = request.data["userID"]) | Q(receiverEmail = receiverEmail)).values('id', 'payerID', 'receiverEmail', 'amount','status'))
    return_records = []
    print(payment_records)
    for records in payment_records:
        new_rec = dict()
        new_rec['id'] = records['id']
        new_rec['payerEmail'] = User.objects.filter(id=records['payerID']).values_list('email', flat=True)[0]
        new_rec['receiverEmail'] = records['receiverEmail']
        new_rec['amount'] = records['amount']
        new_rec['status'] = records['status']
        return_records.append(new_rec) 
    return Response(data = return_records, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def generate_otp(request):
    receiverEmail = User.objects.filter(id=request.data['userID']).values_list('email', flat=True)[0]
    digits = "0123456789"
    OTP = ""
    for i in range(6):
        OTP += digits[math.floor(random.random()*10)]
    otp = OTP + " is your OTP"
    msg = 'Subject: {}\n\n{}'.format("Generated OTP for payment", otp)

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login("otp123authenticator@gmail.com", "fqriotdtdzkuaxcb")
    s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
    record = {'userID': request.data['userID'], 'otp': OTP, 'timeStamp': str(time.time())}
    try:
        existing_otp_record = OtpTable.objects.get(userID=request.data['userID'])
        existing_otp_record.otp = OTP
        existing_otp_record.timeStamp = str(time.time())
        existing_otp_record.save(update_fields=['otp', 'timeStamp'])
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    except:
        serializer = OtpTableSerializer(data=record)
        if serializer.is_valid():
            print('isValid')
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
    return Response(data = "Success")

@api_view(['POST'])
def generate_otp_registration(request):
    receiverEmail = request.data['userEmail']
    print(receiverEmail)
    digits = "0123456789"
    OTP = ""
    for i in range(6):
        OTP += digits[math.floor(random.random()*10)]
    otp = OTP + " is your OTP"
    msg = 'Subject: {}\n\n{}'.format("Generated OTP for payment", otp)

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login("otp123authenticator@gmail.com", "fqriotdtdzkuaxcb")
    s.sendmail("otp123authenticator@gmail.com", receiverEmail, msg)
    record = {'userEmail': request.data['userEmail'], 'otp': OTP, 'timeStamp': str(time.time())}
    try:
        existing_otp_record = OtpTableRegistration.objects.get(userEmail=request.data['userEmail'])
        existing_otp_record.otp = OTP
        existing_otp_record.timeStamp = str(time.time())
        existing_otp_record.save(update_fields=['otp', 'timeStamp'])
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    except:
        serializer = OtpTableRegistrationSerializer(data=record)
        if serializer.is_valid():
            print('isValid')
            serializer.save()
            return Response(data = "Success", status=status.HTTP_201_CREATED)
    return Response(data = "Success")

def verify_user(token):
    return True
