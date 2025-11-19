from django.forms import ModelForm
from .models import Empleado
from django import forms

class EmpleadoForm(ModelForm):
    class Meta:
        model = Empleado
        fields = ["dni", "nombre", "apellido"]
        widgets = {
            "dni": forms.NumberInput(
                attrs={"class": "form-control", "placeholder": "DNI"}
            ),
            "nombre": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Nombre"}
            ),
            "apellido": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Apellido"}
            ),
        }