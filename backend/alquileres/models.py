from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from clientes.models import Cliente
from vehiculos.models import Vehiculo
from empleados.models import Empleado
from decimal import Decimal

# Create your models here.

class Alquiler(models.Model):
    # ForeignKey relationships
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='cliente_dni',
        related_name='alquileres'
    )
    
    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.PROTECT,
        db_column='vehiculo_patente',
        related_name='alquileres'
    )
    
    empleado = models.ForeignKey(
        Empleado,
        on_delete=models.PROTECT,
        db_column='empleado_dni',
        related_name='alquileres'
    )
    
    reserva = models.ForeignKey(
        'reservas.Reserva',
        on_delete=models.SET_NULL,
        db_column='reserva_id',
        null=True,
        blank=True,
        related_name='alquiler'
    )
    
    # Campos de fecha y pago
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    total_pago = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'ALQUILERES'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"Alquiler {self.id} - {self.cliente.nombre} {self.cliente.apellido} - {self.vehiculo.patente}"

    def esta_activo(self):
        """Verifica si el alquiler está activo (no finalizado)"""
        return self.fecha_fin is None

    def calcular_dias_alquilado(self, fecha_fin=None):
        """Calcula los días de alquiler"""
        if fecha_fin is None:
            fecha_fin = timezone.now()
        
        duracion = fecha_fin - self.fecha_inicio
        # Si es menos de 1 día, cobrar 1 día mínimo
        dias = max(1, duracion.days)
        # Si tiene horas adicionales, cobrar día completo
        if duracion.seconds > 0 and duracion.days > 0:
            dias += 1
        
        return dias

    def calcular_total(self, fecha_fin=None):
        """Calcula el total a pagar basado en días, precio del vehículo, multas y daños"""
        # Cálculo base: días * precio por día
        dias = self.calcular_dias_alquilado(fecha_fin)
        total = Decimal(dias) * self.vehiculo.precio_por_dia
        
        # Sumar multas asociadas a este alquiler
        multas_total = self.multa_set.aggregate(
            total=models.Sum('monto')
        )['total'] or Decimal('0.00')
        
        # Sumar daños asociados a este alquiler
        danios_total = self.danio_set.aggregate(
            total=models.Sum('monto')
        )['total'] or Decimal('0.00')
        
        # Total final = precio base + multas + daños
        total_final = total + multas_total + danios_total
        
        return total_final

    def finalizar(self):
        """Finaliza el alquiler, calculando automáticamente el total"""
        if not self.esta_activo():
            raise ValidationError("Este alquiler ya fue finalizado")
        
        self.fecha_fin = timezone.now()
        self.total_pago = self.calcular_total(self.fecha_fin)
        
        # Liberar el vehículo
        self.vehiculo.marcar_como_disponible()
        
        self.save()

    @classmethod
    def crear_alquiler(cls, cliente, vehiculo, empleado, reserva=None):
        """Crea un nuevo alquiler validando que el vehículo esté disponible"""
        # Verificar que el vehículo pueda ser alquilado
        if not vehiculo.puede_alquilarse():
            raise ValidationError(
                f"El vehículo no está disponible para alquilar. Estado: {vehiculo.estado}"
            )
        
        # Crear el alquiler
        alquiler = cls.objects.create(
            cliente=cliente,
            vehiculo=vehiculo,
            empleado=empleado,
            reserva=reserva
        )
        
        # Marcar el vehículo como alquilado
        vehiculo.marcar_como_alquilado()
        
        return alquiler