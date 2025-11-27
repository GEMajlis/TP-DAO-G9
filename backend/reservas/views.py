from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
import json

from .models import Reserva
from .forms import ReservaForm
from vehiculos.models import Vehiculo
from alquileres.models import Alquiler


@csrf_exempt
@require_http_methods(["POST"])
def reserva_create(request):
    """Crear una nueva reserva validando disponibilidad"""
    try:
        data = json.loads(request.body)
        form = ReservaForm(data)
        
        if form.is_valid():
            reserva = form.save(commit=False)
            
            # Validar fechas usando el método clean() del modelo
            try:
                reserva.clean()
            except ValidationError as e:
                return JsonResponse({"error": e.message_dict}, status=400)
            
            # Verificar disponibilidad
            disponible, mensaje = Reserva.verificar_disponibilidad(
                reserva.vehiculo,
                reserva.fecha_inicio,
                reserva.fecha_fin
            )
            
            if not disponible:
                return JsonResponse({"error": mensaje}, status=400)
            
            reserva.save()
            
            return JsonResponse({
                "message": "Reserva creada correctamente",
                "reserva": {
                    "id": reserva.id,
                    "cliente": f"{reserva.cliente.nombre} {reserva.cliente.apellido}",
                    "vehiculo": reserva.vehiculo.patente,
                    "fecha_inicio": reserva.fecha_inicio.isoformat(),
                    "fecha_fin": reserva.fecha_fin.isoformat(),
                    "estado": reserva.estado
                }
            }, status=201)
        else:
            return JsonResponse({"error": form.errors}, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def reserva_list(request):
    """Listar todas las reservas, expirando las pendientes vencidas"""
    try:
        # Expirar reservas pendientes vencidas
        Reserva.objects.filter(
            estado=Reserva.ESTADO_PENDIENTE,
            fecha_inicio__lt=timezone.now().date()
        ).update(estado=Reserva.ESTADO_EXPIRADA)
        
        reservas = Reserva.objects.select_related('cliente', 'vehiculo').all()
        
        reservas_list = [
            {
                "id": reserva.id,
                "cliente_dni": reserva.cliente.dni,
                "cliente_nombre": f"{reserva.cliente.nombre} {reserva.cliente.apellido}",
                "vehiculo_patente": reserva.vehiculo.patente,
                "vehiculo_modelo": f"{reserva.vehiculo.marca} {reserva.vehiculo.modelo}",
                "fecha_reserva": reserva.fecha_reserva.isoformat(),
                "fecha_inicio": reserva.fecha_inicio.isoformat(),
                "fecha_fin": reserva.fecha_fin.isoformat(),
                "estado": reserva.estado
            }
            for reserva in reservas
        ]
        
        return JsonResponse({"reservas": reservas_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def reserva_detail(request, id):
    """Obtener detalle de una reserva específica"""
    try:
        reserva = Reserva.objects.select_related('cliente', 'vehiculo').get(id=id)
        
        return JsonResponse({
            "reserva": {
                "id": reserva.id,
                "cliente_dni": reserva.cliente.dni,
                "cliente_nombre": f"{reserva.cliente.nombre} {reserva.cliente.apellido}",
                "vehiculo_patente": reserva.vehiculo.patente,
                "vehiculo_modelo": f"{reserva.vehiculo.marca} {reserva.vehiculo.modelo}",
                "fecha_reserva": reserva.fecha_reserva.isoformat(),
                "fecha_inicio": reserva.fecha_inicio.isoformat(),
                "fecha_fin": reserva.fecha_fin.isoformat(),
                "estado": reserva.estado
            }
        }, status=200)
        
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
def reserva_update(request, id):
    """Actualizar una reserva existente"""
    try:
        reserva = Reserva.objects.get(id=id)
        
        # Solo se pueden modificar reservas pendientes
        if reserva.estado != Reserva.ESTADO_PENDIENTE:
            return JsonResponse({
                "error": f"No se pueden modificar reservas en estado {reserva.estado}"
            }, status=400)
        
        data = json.loads(request.body)
        form = ReservaForm(data, instance=reserva)
        
        if form.is_valid():
            reserva_actualizada = form.save(commit=False)
            
            # Validar fechas
            try:
                reserva_actualizada.clean()
            except ValidationError as e:
                return JsonResponse({"error": e.message_dict}, status=400)
            
            # Verificar disponibilidad (excluyendo esta reserva)
            disponible, mensaje = Reserva.verificar_disponibilidad(
                reserva_actualizada.vehiculo,
                reserva_actualizada.fecha_inicio,
                reserva_actualizada.fecha_fin,
                excluir_id=reserva.id
            )
            
            if not disponible:
                return JsonResponse({"error": mensaje}, status=400)
            
            reserva_actualizada.save()
            
            return JsonResponse({
                "message": "Reserva actualizada correctamente",
                "reserva": {
                    "id": reserva_actualizada.id,
                    "estado": reserva_actualizada.estado,
                    "fecha_inicio": reserva_actualizada.fecha_inicio.isoformat(),
                    "fecha_fin": reserva_actualizada.fecha_fin.isoformat()
                }
            }, status=200)
        else:
            return JsonResponse({"error": form.errors}, status=400)
            
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def reserva_delete(request, id):
    """Eliminar una reserva"""
    try:
        reserva = Reserva.objects.get(id=id)
        
        # Solo se pueden eliminar reservas pendientes o canceladas
        if reserva.estado not in [Reserva.ESTADO_PENDIENTE, Reserva.ESTADO_CANCELADA]:
            return JsonResponse({
                "error": f"No se pueden eliminar reservas en estado {reserva.estado}"
            }, status=400)
        
        reserva.delete()
        return JsonResponse({"message": "Reserva eliminada correctamente"}, status=200)
        
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reserva_confirmar(request, id):
    """Confirmar una reserva pendiente"""
    try:
        reserva = Reserva.objects.get(id=id)
        
        try:
            reserva.confirmar()
            return JsonResponse({
                "message": "Reserva confirmada correctamente",
                "reserva": {
                    "id": reserva.id,
                    "estado": reserva.estado
                }
            }, status=200)
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
            
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reserva_cancelar(request, id):
    """Cancelar una reserva"""
    try:
        reserva = Reserva.objects.get(id=id)
        
        try:
            reserva.cancelar()
            return JsonResponse({
                "message": "Reserva cancelada correctamente",
                "reserva": {
                    "id": reserva.id,
                    "estado": reserva.estado
                }
            }, status=200)
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
            
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def reservas_del_dia(request):
    """Obtener reservas confirmadas para el día actual"""
    try:
        hoy = timezone.now().date()
        
        reservas = Reserva.objects.filter(
            estado=Reserva.ESTADO_PENDIENTE,
            fecha_inicio=hoy
        ).select_related('cliente', 'vehiculo')
        
        reservas_list = [
            {
                "id": reserva.id,
                "cliente_dni": reserva.cliente.dni,
                "cliente_nombre": f"{reserva.cliente.nombre} {reserva.cliente.apellido}",
                "vehiculo_patente": reserva.vehiculo.patente,
                "vehiculo_modelo": f"{reserva.vehiculo.marca} {reserva.vehiculo.modelo}",
                "fecha_reserva": reserva.fecha_reserva.isoformat(),
                "fecha_inicio": reserva.fecha_inicio.isoformat(),
                "fecha_fin": reserva.fecha_fin.isoformat(),
                "estado": reserva.estado
            }
            for reserva in reservas
        ]
        
        return JsonResponse({"reservas": reservas_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def convertir_a_alquiler(request, id):
    """Convertir una reserva confirmada a alquiler"""
    try:
        data = json.loads(request.body)
        empleado_dni = data.get('empleado_dni')
        
        if not empleado_dni:
            return JsonResponse({"error": "Se requiere empleado_dni"}, status=400)
        
        with transaction.atomic():
            reserva = Reserva.objects.select_for_update().get(id=id)
            
            # Verificar que la reserva esté confirmada
            if reserva.estado != Reserva.ESTADO_CONFIRMADA:
                return JsonResponse({
                    "error": f"Solo se pueden convertir reservas confirmadas. Estado actual: {reserva.estado}"
                }, status=400)
            
            # Re-validar disponibilidad del vehículo
            disponible, mensaje = Reserva.verificar_disponibilidad(
                reserva.vehiculo,
                reserva.fecha_inicio,
                reserva.fecha_fin,
                excluir_id=reserva.id
            )
            
            if not disponible:
                return JsonResponse({
                    "error": f"El vehículo ya no está disponible: {mensaje}"
                }, status=400)
            
            # Verificar que el vehículo pueda ser alquilado
            if not reserva.vehiculo.puede_alquilarse():
                return JsonResponse({
                    "error": f"El vehículo no puede ser alquilado. Estado: {reserva.vehiculo.estado}"
                }, status=400)
            
            # Crear el alquiler
            alquiler = Alquiler.objects.create(
                cliente_dni=reserva.cliente.dni,
                vehiculo_patente=reserva.vehiculo.patente,
                empleado_dni=empleado_dni,
                reserva=reserva
            )
            
            # Actualizar estado del vehículo
            reserva.vehiculo.marcar_como_alquilado()
            
            # Marcar reserva como completada
            reserva.completar()
            
            return JsonResponse({
                "message": "Reserva convertida a alquiler correctamente",
                "alquiler": {
                    "id": alquiler.id,
                    "reserva_id": reserva.id,
                    "cliente_dni": alquiler.cliente_dni,
                    "vehiculo_patente": alquiler.vehiculo_patente,
                    "fecha_inicio": alquiler.fecha_inicio.isoformat()
                }
            }, status=201)
            
    except Reserva.DoesNotExist:
        return JsonResponse({"error": "Reserva no encontrada"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
