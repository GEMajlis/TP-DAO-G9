from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Q
from clientes.models import Cliente
from vehiculos.models import Vehiculo
from mantenimiento.models import Mantenimiento

# Create your models here.

class Reserva(models.Model):
    # Estados de la reserva
    ESTADO_PENDIENTE = 'pendiente'
    ESTADO_CONFIRMADA = 'confirmada'
    ESTADO_CANCELADA = 'cancelada'
    ESTADO_EXPIRADA = 'expirada'
    ESTADO_COMPLETADA = 'completada'
    
    ESTADOS = [
        (ESTADO_PENDIENTE, 'Pendiente'),
        (ESTADO_CONFIRMADA, 'Confirmada'),
        (ESTADO_CANCELADA, 'Cancelada'),
        (ESTADO_EXPIRADA, 'Expirada'),
        (ESTADO_COMPLETADA, 'Completada'),
    ]

    # ForeignKey relationships
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='cliente_dni',
        related_name='reservas'
    )
    
    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.PROTECT,
        db_column='vehiculo_patente',
        related_name='reservas'
    )
    
    # Campos de fecha
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    
    # Estado
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default=ESTADO_PENDIENTE
    )

    class Meta:
        db_table = 'RESERVAS'
        ordering = ['-fecha_reserva']

    def __str__(self):
        return f"Reserva {self.id} - {self.cliente.nombre} {self.cliente.apellido} - {self.vehiculo.patente}"

    def clean(self):
        """Validar fechas de la reserva"""
        super().clean()
        
        # Validar que fecha_inicio sea futura
        if self.fecha_inicio and self.fecha_inicio < timezone.now().date():
            raise ValidationError({
                'fecha_inicio': 'La fecha de inicio debe ser futura, no se pueden hacer reservas para fechas pasadas.'
            })
        
        # Validar que fecha_inicio sea anterior a fecha_fin
        if self.fecha_inicio and self.fecha_fin and self.fecha_inicio >= self.fecha_fin:
            raise ValidationError({
                'fecha_fin': 'La fecha de fin debe ser posterior a la fecha de inicio.'
            })

    @classmethod
    def verificar_disponibilidad(cls, vehiculo, fecha_inicio, fecha_fin, excluir_id=None):
        """
        Verifica si un vehículo está disponible para reservar en el rango de fechas dado.
        
        Retorna tupla (disponible: bool, mensaje_error: str)
        """
        # 1. Verificar solapamiento con otras reservas confirmadas
        query_reservas = Q(
            vehiculo=vehiculo,
            estado=cls.ESTADO_CONFIRMADA,
            fecha_inicio__lt=fecha_fin,
            fecha_fin__gt=fecha_inicio
        )
        
        if excluir_id:
            query_reservas &= ~Q(id=excluir_id)
        
        reservas_solapadas = cls.objects.filter(query_reservas).exists()
        
        if reservas_solapadas:
            return (False, 'El vehículo ya tiene una reserva confirmada en ese período.')
        
        # 2. Verificar solapamiento con alquileres activos
        from alquileres.models import Alquiler
        
        # Alquileres sin fecha_fin (activos) o con fechas que solapan
        query_alquileres = Q(
            vehiculo=vehiculo,
            fecha_fin__isnull=True  # Alquiler activo
        ) | Q(
            vehiculo=vehiculo,
            fecha_inicio__date__lt=fecha_fin,
            fecha_fin__date__gt=fecha_inicio
        )
        
        alquileres_solapados = Alquiler.objects.filter(query_alquileres).exists()
        
        if alquileres_solapados:
            return (False, 'El vehículo tiene un alquiler activo o programado en ese período.')
        
        # 3. Verificar solapamiento con mantenimientos
        query_mantenimientos = Q(
            vehiculo=vehiculo,
            fecha_inicio__lt=fecha_fin,
        ) & (
            Q(fecha_fin__gt=fecha_inicio) | Q(fecha_fin__isnull=True)
        )
        
        mantenimientos_solapados = Mantenimiento.objects.filter(query_mantenimientos).exists()
        
        if mantenimientos_solapados:
            return (False, 'El vehículo tiene un mantenimiento programado en ese período.')
        
        return (True, '')

    def confirmar(self):
        """Confirma la reserva"""
        if self.estado != self.ESTADO_PENDIENTE:
            raise ValidationError(f'Solo se pueden confirmar reservas pendientes. Estado actual: {self.estado}')
        
        # Re-validar disponibilidad antes de confirmar
        disponible, mensaje = self.verificar_disponibilidad(
            self.vehiculo,
            self.fecha_inicio,
            self.fecha_fin,
            excluir_id=self.id
        )
        
        if not disponible:
            raise ValidationError(f'No se puede confirmar la reserva: {mensaje}')
        
        self.estado = self.ESTADO_CONFIRMADA
        self.save()

    def cancelar(self):
        """Cancela la reserva"""
        if self.estado in [self.ESTADO_CANCELADA, self.ESTADO_COMPLETADA, self.ESTADO_EXPIRADA]:
            raise ValidationError(f'No se puede cancelar una reserva en estado {self.estado}')
        
        self.estado = self.ESTADO_CANCELADA
        self.save()

    def expirar(self):
        """Expira la reserva si la fecha de inicio ya pasó"""
        if self.estado != self.ESTADO_PENDIENTE:
            return False
        
        if self.fecha_inicio < timezone.now().date():
            self.estado = self.ESTADO_EXPIRADA
            self.save()
            return True
        
        return False

    def completar(self):
        """Marca la reserva como completada (cuando se convierte a alquiler)"""
        if self.estado != self.ESTADO_CONFIRMADA:
            raise ValidationError('Solo se pueden completar reservas confirmadas')
        
        self.estado = self.ESTADO_COMPLETADA
        self.save()