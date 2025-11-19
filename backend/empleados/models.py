from django.db import models

class Empleado(models.Model):

    dni = models.IntegerField(max_length=15, unique=True, primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)

    class Meta:
        db_table = 'EMPLEADOS'
