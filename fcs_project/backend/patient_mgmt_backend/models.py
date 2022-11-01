from django.db import models

# Create your models here.
class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)

class UploadRecords(models.Model):
    userID = models.CharField(max_length=30)
    docLink = models.CharField(max_length=100)
    docType = models.CharField(max_length=30)

class ShareRecords(models.Model):
    userID = models.CharField(max_length=30)
    receiverID = models.CharField(max_length=30)
    docLink = models.CharField(max_length=100)
    docType = models.CharField(max_length=30)

class PaymentRecords(models.Model):
    userID = models.CharField(max_length=30)
    receiverID = models.CharField(max_length=30)
    amount = models.FloatField()
    status = models.CharField(max_length=30)
    Type = models.CharField(max_length=30)

class UserTable(models.Model):
    email = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    role=models.CharField(max_length=50, default='PT')
    address=models.CharField(max_length=300, default='none')
    contact=models.CharField(max_length=15, default='none')
    vAadhar=models.CharField(max_length=50, default='none')
    healthLicense=models.CharField(max_length=200, default='none')
    description=models.CharField(max_length=500, default='none')
    location=models.CharField(max_length=200, default='none')
    image1Path=models.CharField(max_length=100, default='none')
    image2Path=models.CharField(max_length=100, default='none')
    status=models.CharField(max_length=50, default='NA')
