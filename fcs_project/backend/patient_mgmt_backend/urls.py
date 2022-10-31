from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('hello/', views.say_hello, name='say_hello'),
    path('payment_gateway/', views.initiate_transaction, name='initiate_transaction')
]