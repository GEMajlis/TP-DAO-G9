from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from empleados.models import Empleado
from vehiculos.models import Vehiculo


class Mantenimiento(models.Model):
    id_mantenimiento = models.AutoField(primary_key=True)

    empleado = models.ForeignKey(
        Empleado,
        on_delete=models.PROTECT,
        db_column='DNI_empleado'
    )

    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.PROTECT,
        db_column='patente_vehiculo'
    )

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'MANTENIMIENTOS'

    @classmethod
    @classmethod
    def iniciar_mantenimiento(cls, empleado: Empleado, vehiculo: Vehiculo):

    # 🚫 1. Verificar si ya existe un mantenimiento activo para este vehículo
        if cls.objects.filter(vehiculo=vehiculo, fecha_fin__isnull=True).exists():
            raise ValidationError("El vehículo ya tiene un mantenimiento activo.")

    # 2. Validar que el vehículo pueda entrar en mantenimiento
        try:
            vehiculo.marcar_como_mantenimiento()
        except ValidationError as e:
            raise ValidationError(f"No se puede iniciar mantenimiento: {str(e)}")

    # 3. Crear el nuevo mantenimiento
        mantenimiento = cls.objects.create(
            empleado=empleado,
            vehiculo=vehiculo,
            fecha_inicio=timezone.now().date()
        )

        return mantenimiento


    @classmethod
    def finalizar_mantenimiento_por_id(cls, id_mantenimiento: int):
        """
        Finaliza un mantenimiento existente:
        - Marca la fecha_fin como hoy.
        - Cambia el estado del vehículo a disponible.
        """
        try:
            mantenimiento = cls.objects.get(id_mantenimiento=id_mantenimiento)
        except cls.DoesNotExist:
            raise ValidationError("El mantenimiento no existe.")

        if mantenimiento.fecha_fin is not None:
            raise ValidationError("El mantenimiento ya fue finalizado.")

        # Finalizar mantenimiento en el vehículo
        try:
            mantenimiento.vehiculo.finalizar_mantenimiento()
        except ValidationError as e:
            raise ValidationError(f"No se puede finalizar mantenimiento: {str(e)}")

        # Registrar la fecha fin
        mantenimiento.fecha_fin = timezone.now().date()
        mantenimiento.save()

        return mantenimiento
