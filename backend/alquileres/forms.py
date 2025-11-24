from django.forms import ModelForm
from .models import Alquiler
from django import forms


class AlquilerForm(ModelForm):
    class Meta:
        model = Alquiler
        fields = ["cliente", "vehiculo", "empleado", "reserva"]
        widgets = {
            "cliente": forms.Select(
                attrs={"class": "form-control"}
            ),
            "vehiculo": forms.Select(
                attrs={"class": "form-control"}
            ),
            "empleado": forms.Select(
                attrs={"class": "form-control"}
            ),
            "reserva": forms.Select(
                attrs={"class": "form-control"}
            ),
        }
