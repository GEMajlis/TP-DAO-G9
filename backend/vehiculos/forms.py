from django.forms import ModelForm
from .models import Vehiculo
from django import forms

class VehiculoForm(ModelForm):
    class Meta:
        model = Vehiculo
        fields = ["patente", "marca", "modelo", "color"]
        widgets = {
            "patente": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Patente"}
            ),
            "marca": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Marca"}
            ),
            "modelo": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Modelo"}
            ),
            "color": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Color"}
            ),
            "precio_por_dia": forms.NumberInput(
                attrs={"class": "form-control", "placeholder": "Precio por día"}
            ),  
        }