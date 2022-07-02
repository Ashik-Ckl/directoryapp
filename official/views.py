from urllib import request
from django.shortcuts import render
# Create your views here.

def log_in(request):
    return render(request, 'signin.html')

def subjects(request):
    return render(request, 'subjects.html')

def teacher(request):
    return render(request, 'teacher.html')

def view_profile(request):
    return render(request, 'view-profile.html')