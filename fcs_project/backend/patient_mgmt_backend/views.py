from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *

# Create your views here.
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
        user_id = request.data["UserID"]
        record = UploadRecords.objects.get(pk=user_id)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except UploadRecords.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def insert_upload_records(request):
    # if not verify_user(request.data["token"]):
    #     return Response(detail = "Unauthorized User", status=status.HTTP_400_BAD_REQUEST)
    # print(request.data)
    print(dict(request.data))
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
    serializer = UserTableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(data = "Success", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def display_user_table(request):
    note = UserTable.objects.all()
    serializer = UserTableSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_healthcare_professionals(request):
    note = UserTable.objects.filter(role='HealthcareProfessional').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserTableSerializer(note, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_all_pharmacy(request):
    note = UserTable.objects.filter(role='Pharmacy').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserTableSerializer(note, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_insurance_firm(request):
    note = UserTable.objects.filter(role='InsuranceFirm').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserTableSerializer(note, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_hospital(request):
    note = UserTable.objects.filter(role='Hospital').values('name', 'email', 'location', 'description', 'contact', 'id')
    serializer = UserTableSerializer(note, many=True)
    return Response(serializer.data)

def verify_user(token):
    return True
