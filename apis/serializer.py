from dataclasses import fields
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate
from . models import subjects, teacher
from rest_framework.exceptions import ValidationError
from versatileimagefield.serializers import VersatileImageFieldSerializer
from rest_framework import status
from rest_framework.response import Response

class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    def validate(self, attrs):
        """Validate and authenticate the user"""
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password
        )
        if user:
            attrs['user'] = user
            return attrs
        else:
            msg = ('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')
        
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = subjects
        fields = '__all__'
        
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = teacher
        fields  = '__all__'
        
    def validate(self, attrs):
        if len(attrs.get('subject'))  > 5:
            msg = ('You have selected morethan 5 subjects')
            raise serializers.ValidationError(msg)
        return super().validate(attrs)
        
class GetTeacherSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True, many=True)
    profile_picture = VersatileImageFieldSerializer(
        sizes=[
            ('small_square_crop', 'crop__50x50'),
            ('medium_square_crop', 'crop__200x200'),
        ]
    )
    class Meta:
        model = teacher
        fields = '__all__'