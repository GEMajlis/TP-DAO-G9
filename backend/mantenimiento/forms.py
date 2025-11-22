'''from django import forms
from empleados.models import Empleado
from vehiculos.models import Vehiculo
from mantenimiento.models import Mantenimiento
from django.core.exceptions import ValidationError


class MantenimientoForm(forms.Form):
    dni_empleado = forms.IntegerField(
        label="DNI del empleado",
        widget=forms.NumberInput(attrs={"class": "form-control", "placeholder": "DNI"})
    )

    patente_vehiculo = forms.CharField(
        label="Patente del vehículo",
        max_length=10,
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Patente"})
    )

    fecha_inicio = forms.DateField(
        required=False,
        widget=forms.DateInput(
            attrs={"class": "form-control", "type": "date"}
        )
    )

    def save(self):
        """
        Usa la lógica de negocio definida en el modelo:
        Mantenimiento.iniciar_mantenimiento(empleado, vehiculo)
        """
        dni = self.cleaned_data["dni_empleado"]
        patente = self.cleaned_data["patente_vehiculo"]

        # Obtener empleado
        try:
            empleado = Empleado.objects.get(dni=dni)
        except Empleado.DoesNotExist:
            raise ValidationError("El empleado no existe")

        # Obtener vehículo
        try:
            vehiculo = Vehiculo.objects.get(patente=patente)
        except Vehiculo.DoesNotExist:
            raise ValidationError("El vehículo no existe")

        # Crear mantenimiento usando tu método de negocio
        mantenimiento = Mantenimiento.iniciar_mantenimiento(
            empleado=empleado,
            vehiculo=vehiculo
        )

        return mantenimiento
'''