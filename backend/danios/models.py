from django.db import models
from django.core.exceptions import ValidationError

from alquileres.models import Alquiler


class Danio(models.Model):
    id_danio = models.AutoField(primary_key=True)

    alquiler = models.ForeignKey(
        Alquiler,
        on_delete=models.PROTECT,
        db_column='ID_alquiler'
    )

    descripcion = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'DANIOS'

    # VALIDACIONES
    def clean(self):
        if self.monto <= 0:
            raise ValidationError("El monto del daño debe ser mayor a cero.")

        if not self.descripcion.strip():
            raise ValidationError("La descripción del daño no puede estar vacía.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
