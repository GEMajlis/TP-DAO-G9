from django.forms import ModelForm
from .models import Cliente
from django import forms


class ClienteForm(ModelForm):
    class Meta:
        model = Cliente
        fields = ["dni", "nombre", "apellido", "telefono"]
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
            "telefono": forms.NumberInput(
                attrs={"class": "form-control", "placeholder": "Teléfono"}
            ),
        }
