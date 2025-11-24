from django.db import models
from django.core.exceptions import ValidationError

from alquileres.models import Alquiler


class Multa(models.Model):
    id_multa = models.AutoField(primary_key=True)

    alquiler = models.ForeignKey(
        Alquiler,
        on_delete=models.PROTECT,
        db_column='ID_alquiler'
    )

    motivo = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'MULTAS'

    # VALIDACIONES
    def clean(self):
        if self.monto <= 0:
            raise ValidationError("El monto de la multa debe ser mayor a cero.")

        if not self.motivo.strip():
            raise ValidationError("El motivo de la multa no puede estar vacío.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
