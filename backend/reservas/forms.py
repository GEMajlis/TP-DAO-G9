from django.forms import ModelForm
from .models import Reserva
from django import forms


class ReservaForm(ModelForm):
    class Meta:
        model = Reserva
        fields = ["cliente", "vehiculo", "fecha_inicio", "fecha_fin"]
        widgets = {
            "cliente": forms.Select(
                attrs={"class": "form-control"}
            ),
            "vehiculo": forms.Select(
                attrs={"class": "form-control"}
            ),
            "fecha_inicio": forms.DateInput(
                attrs={"class": "form-control", "type": "date"}
            ),
            "fecha_fin": forms.DateInput(
                attrs={"class": "form-control", "type": "date"}
            ),
        }
