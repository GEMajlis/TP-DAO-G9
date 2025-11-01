from django.db import models

# Create your models here.

class Cliente(models.Model):
    dni = models.IntegerField(unique=True, primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.IntegerField()

