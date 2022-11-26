from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from email.policy import default

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
  vAadhar=models.CharField(max_length=50, default='none')
  healthLicense=models.CharField(max_length=200, default='none')
  description=models.CharField(max_length=500, default='none')
  location=models.CharField(max_length=200, default='none')
  image1Path=models.CharField(max_length=100, default='none')
  image2Path=models.CharField(max_length=100, default='none')
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
    userID = models.CharField(max_length=30)
    docLink = models.CharField(max_length=5000)
    docType = models.CharField(max_length=30)


class PaymentRecords(models.Model):
    #The Patient is payer in case of pharmacy [We will get Email for this guy from frontend]. Insurance company is payer in Insurance view
    payerID = models.CharField(max_length=30) 
    receiverEmail = models.CharField(max_length=30) #
    amount = models.FloatField()
    status = models.CharField(max_length=30)


class ShareRecords(models.Model):
    userID = models.CharField(max_length=30)
    receiverEmail = models.CharField(max_length=30)
    reportID = models.CharField(max_length = 30)
    billMade = models.CharField(max_length=30)
    docLink = models.CharField(max_length=100)
    docType = models.CharField(max_length=30)

class OtpTable(models.Model):
    userID = models.CharField(max_length=30)
    otp = models.CharField(max_length=30)
    timeStamp = models.CharField(max_length=100)

class OtpTableRegistration(models.Model):
    userEmail = models.CharField(max_length=50)
    otp = models.CharField(max_length=30)
    timeStamp = models.CharField(max_length=100)