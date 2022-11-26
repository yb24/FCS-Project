from django.urls import path
from patient_mgmt_backend.views import UserLoginView, UserProfileView, UserRegistrationView
from .views import *
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('note', note),
    path('notedetails', note_detail),
    path('insert_upload_records', insert_upload_records),
    path('delete_upload_records', delete_upload_records),
    path('insert_user_table', insert_user_table),
    path('display_user_table',display_user_table),
    path('get_all_healthcare_professionals', get_all_healthcare_professionals),
    path('get_all_pharmacy', get_all_pharmacy),
    path('get_all_insurance_firm', get_all_insurance_firm),
    path('get_all_hospital', get_all_hospital),
    path('display_upload_records', display_upload_records),
    path('share_document', share_document),
    path('display_shared_documents', display_shared_documents),
    path('display_unmade_bills', display_unmade_bills),
    path('make_bill', make_bill),
    path('display_payments_to_be_made', display_payments_to_be_made),
    path('make_payment', make_payment),
    path('display_all_payment_records', display_all_payment_records),
    path('generate_otp', generate_otp),
    path('generate_otp_registration', generate_otp_registration),
]