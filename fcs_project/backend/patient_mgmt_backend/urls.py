from django.urls import path
from patient_mgmt_backend.views import UserLoginView, UserProfileView, UserRegistrationView
from .views import *
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('note', note),
    path('notedetails', note_detail),
    path('insert_upload_records', insert_upload_records),
    path('delete_upload_records', delete_upload_records),
    path('insert_user_table', insert_user_table),
    path('display_user_table',display_user_table),
    path('get_all_healthcare_professionals', get_all_healthcare_professionals),
    path('get_all_pharmacy', get_all_pharmacy),
    path('get_all_insurance_firm', get_all_insurance_firm),
    path('get_all_hospital', get_all_hospital)
]