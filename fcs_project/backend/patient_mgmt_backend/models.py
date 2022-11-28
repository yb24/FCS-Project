from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from email.policy import default
from patient_mgmt_backend.validators import *
import uuid

#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, email, name, tc, role, address, contact, vAadhar, healthLicense, description, location, image1Path, image2Path, status, otp, password=None, password2=None,):
      """
      Creates and saves a User with the given email, name, tc and password.
      """
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          name=name,
          tc=tc,
          role=role,
          address=address, 
          contact=contact, 
          vAadhar=vAadhar, 
          healthLicense=healthLicense, 
          description=description, 
          location=location, 
          image1Path=image1Path, 
          image2Path=image2Path, 
          status=status,
          otp=otp,
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, name, tc, role, address, contact, vAadhar, healthLicense, description, location, image1Path, image2Path, status, otp, password=None):
      """
      Creates and saves a superuser with the given email, name, tc and password.
      """
      user = self.create_user(
          email,
          password=password,
          name=name,
          tc=tc,
          role=role,
          address=address, 
          contact=contact, 
          vAadhar=vAadhar, 
          healthLicense=healthLicense, 
          description=description, 
          location=location, 
          image1Path=image1Path, 
          image2Path=image2Path, 
          status=status,
          otp=otp,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  name = models.CharField(max_length=200)
  tc = models.BooleanField()
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  roleChoices = [('AD', 'Admin'), ('PT','Patient'), ('HP', 'HealthcareProfessional'), ('HS','Hospital'), ('PH','Pharmacy'),('IF','InsuranceFirm')]
  statusChoices = [('AU','Authenticated'), ('NA','NotAuthenticated'),('RM','Removed')]

  role=models.CharField(max_length=50, choices=roleChoices, default='PT')
  address=models.CharField(max_length=300, default='none')
  contact=models.CharField(max_length=15, default='none')
  vAadhar=models.CharField(max_length=500, default='none')
  healthLicense=models.CharField(max_length=200, default='none')
  description=models.CharField(max_length=500, default='none')
  location=models.CharField(max_length=200, default='none')
  image1Path=models.CharField(max_length=500, default='none')
  image2Path=models.CharField(max_length=500, default='none')
  status=models.CharField(max_length=50, choices=statusChoices, default='NA')
  otp=models.CharField(max_length=300,default='')

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name', 'tc', 'role', 'address', 'contact', 'status','vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path', 'otp']

  def __str__(self):
      return self.email

  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"
      # Simplest possible answer: Yes, always
      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      # Simplest possible answer: Yes, always
      return True

  @property
  def is_staff(self):
      "Is the user a member of staff?"
      # Simplest possible answer: All admins are staff
      return self.is_admin


# Create your models here.
class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)

class UploadRecords(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userID = models.CharField(max_length=100)
    docLink = models.CharField(max_length=200)
    docType = models.CharField(max_length=30)
    isVerified = models.CharField(max_length=30)
    fileHash = models.CharField(max_length=1000)

class PaymentRecords(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #The Patient is payer in case of pharmacy [We will get Email for this guy from frontend]. Insurance company is payer in Insurance view
    payerID = models.CharField(max_length=100) 
    receiverEmail = models.CharField(max_length=255) #
    amount = models.FloatField()
    status = models.CharField(max_length=30)


class ShareRecords(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userID = models.CharField(max_length=100)
    receiverEmail = models.CharField(max_length=255)
    reportID = models.CharField(max_length = 100)
    billMade = models.CharField(max_length=30)
    docLink = models.CharField(max_length=200)
    docType = models.CharField(max_length=30)
    isVerified = models.CharField(max_length=30)
    fileHash = models.CharField(max_length=1000)
    

class OtpTable(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userID = models.CharField(max_length=100)
    otp = models.CharField(max_length=30)
    timeStamp = models.DateTimeField(auto_now_add=True)

class OtpTableRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userEmail = models.CharField(max_length=255)
    otp = models.CharField(max_length=30)
    timeStamp = models.DateTimeField(auto_now_add=True)

class PendingDocumentRequests(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userID = models.CharField(max_length=100)
    receiverEmail = models.CharField(max_length=255)
    docType = models.CharField(max_length=30)
    date = models.CharField(max_length=100)
    requestCompleted = models.CharField(max_length=30)

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.FileField(upload_to='post_images', validators=[validate_file_size, validate_file_extension])

    def __str__(self):
        return self.title

class UserWallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userID = models.CharField(max_length=100)
    amount = models.FloatField()
    lastAddedMoney = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(amount__gte = 0), name='amount_gte_0')
        ]

   