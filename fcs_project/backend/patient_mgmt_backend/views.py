from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
# request -> response
# request handler
# action

def say_hello(request):
    return HttpResponse('Hello World')

def initiate_transaction(request):
    return render(request, 'payment_gateway.html', {'payer_id':432423, 'receiver_id':54654})