import email
from django import http
from django.shortcuts import render
from rest_framework import generics
from rest_framework.settings import api_settings
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializer import AuthTokenSerializer,SubjectSerializer,TeacherSerializer,GetTeacherSerializer
from . models import subjects,teacher
import json
# Create your views here.

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    
class CreateSubjects(viewsets.ModelViewSet):
    serilizer_class = SubjectSerializer
    queryset = subjects.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def create(self, serializer):
        subjectname = self.request.POST['subject']
        if subjects.objects.filter(subject=subjectname).exists():
            res = ValidationError({'message':'subjects exists already'})
            res.status_code = 208
            raise res
        else:
            return super().create(serializer)
        
    def update(self, request, *args, **kwargs):
        subjectname = self.request.POST['subject']
        if subjects.objects.filter(subject=subjectname).exclude(id=self.kwargs['pk']).exists():
            res = ValidationError({'message':'subjects exists already'})
            res.status_code = 208
            raise res
        else:
            return super().update(request, *args, **kwargs)
    
    def get_serializer_class(self):
        return SubjectSerializer

class Teacher(viewsets.ModelViewSet):
    serilizer_class = TeacherSerializer
    queryset = teacher.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        subject = self.request.query_params.get('subjects')
        print(subject)
        if subject != None:
            subject = json.loads(subject)
            return self.queryset.filter(subject__in=subject)
        return self.queryset.all()
    
    def create(self, serializer):
        email = self.request.POST['email']
        if teacher.objects.filter(email=email).exists():
            res = ValidationError({'message':'email exists already'})
            res.status_code = 208
            raise res
        else:
            return super().create(serializer)
        
    def update(self, request, *args, **kwargs):
        eamil = self.request.POST['email']
        if teacher.objects.filter(email=eamil).exclude(id=self.kwargs['pk']).exists():
            res = ValidationError({'message':'email exists already'})
            res.status_code = 208
            raise res
        else:
            return super().update(request, *args, **kwargs)
        
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetTeacherSerializer
        return TeacherSerializer

class GetLoginUserDetails(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self,request,format=None):
        username = request.user.username
        return Response({'username':username})

class Logout(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        self,request.user.auth_token.delete()
        return Response(status.HTTP_200_OK)
    
    