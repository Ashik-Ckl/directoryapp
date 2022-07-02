from itertools import count
from pyexpat import model
from django.db import models
from versatileimagefield.fields import VersatileImageField, PPOIField
from phone_field import PhoneField
from django.core.exceptions import ValidationError

# Create your models here.

class subjects(models.Model):
    subject = models.CharField(max_length=30,unique=True)
    
class teacher(models.Model):
    first_name          = models.CharField(max_length=50)
    last_name           = models.CharField(max_length=50)
    profile_picture     = VersatileImageField(upload_to = 'profileoictures',ppoi_field='profilepicture_ppoi',default='default.jpg',blank=True)
    profilepicture_ppoi = PPOIField()
    email               = models.EmailField(unique=True)
    address             = models.TextField(null=True)
    phone               = PhoneField()
    room_number         = models.CharField(max_length=10)
    subject             = models.ManyToManyField(subjects)
    

    
    
