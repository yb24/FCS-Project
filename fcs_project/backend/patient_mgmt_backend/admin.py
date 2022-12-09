from django.contrib import admin
from patient_mgmt_backend.models import User, OtpTableRegistration
from .models import UploadRecords
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'email', 'name', 'tc', 'is_admin', 'role', 'address', 'contact', 'vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path', 'status', 'otp')
  list_filter = ('is_admin',)
  fieldsets = (
      ('User Credentials', {'fields': ('email', 'password')}),
      ('Personal info', {'fields': ('name', 'tc', 'role', 'address', 'contact', 'vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path', 'status', 'otp')}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('email', 'name', 'tc', 'password1', 'password2', 'role', 'address', 'contact', 'vAadhar', 'healthLicense', 'description', 'location', 'image1Path', 'image2Path', 'status', 'otp'),
      }),
  )
  search_fields = ('email',)
  ordering = ('email', 'id')
  filter_horizontal = ()


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
admin.site.register(UploadRecords)