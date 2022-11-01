from django.urls import path
from .views import *

urlpatterns = [
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