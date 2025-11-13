from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

class Vehiculo(models.Model):
    ESTADO_DISPONIBLE = 'disponible'
    ESTADO_ALQUILADO = 'alquilado'
    ESTADO_MANTENIMIENTO = 'mantenimiento'

    patente = models.CharField(max_length=10, unique=True, primary_key=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=30)
    estado = models.CharField(max_length=20, default=ESTADO_DISPONIBLE)  # e.g., 'disponible', 'en mantenimiento', etc.

    def puede_alquilarse(self):
        """Verifica si el vehículo está disponible para alquilar"""
        return self.estado == self.ESTADO_DISPONIBLE
    
    def marcar_como_alquilado(self):
        """Cambia el estado a alquilado si está disponible"""
        if not self.puede_alquilarse():
            raise ValidationError(
                f"No se puede alquilar el vehículo. Estado actual: {self.get_estado_display()}"
            )
        self.estado = self.ESTADO_ALQUILADO
        self.save()
    
    def marcar_como_disponible(self):
        """Cambia el estado a disponible"""
        self.estado = self.ESTADO_DISPONIBLE
        self.save()
    
    def marcar_como_mantenimiento(self):
        """Cambia el estado a mantenimiento si no está alquilado"""
        if self.estado == self.ESTADO_ALQUILADO:
            raise ValidationError(
                "No se puede poner en mantenimiento un vehículo que está alquilado"
            )
        self.estado = self.ESTADO_MANTENIMIENTO
        self.save()
    
    def finalizar_mantenimiento(self):
        """Finaliza el mantenimiento y marca como disponible"""
        if self.estado != self.ESTADO_MANTENIMIENTO:
            raise ValidationError(
                "El vehículo no está en mantenimiento"
            )
        self.marcar_como_disponible()

    class Meta:
        db_table = 'VEHICULOS'