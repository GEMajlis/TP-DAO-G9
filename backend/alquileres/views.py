from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
import json

from .models import Alquiler
from .forms import AlquilerForm
from clientes.models import Cliente
from vehiculos.models import Vehiculo
from empleados.models import Empleado
from reservas.models import Reserva


@csrf_exempt
@require_http_methods(["POST"])
def alquiler_create(request):
    """Crear un nuevo alquiler"""
    try:
        data = json.loads(request.body)
        
        # Obtener los objetos relacionados
        try:
            cliente_dni = data.get('cliente')
            vehiculo_patente = data.get('vehiculo')
            empleado_dni = data.get('empleado')
            
            # Convertir DNIs a entero si vienen como string
            if isinstance(cliente_dni, str):
                cliente_dni = int(cliente_dni)
            if isinstance(empleado_dni, str):
                empleado_dni = int(empleado_dni)
            
            cliente = Cliente.objects.get(dni=cliente_dni)
            vehiculo = Vehiculo.objects.get(patente=vehiculo_patente)
            empleado = Empleado.objects.get(dni=empleado_dni)
            reserva = None
            
            if data.get('reserva'):
                reserva = Reserva.objects.get(id=data.get('reserva'))
                
        except Cliente.DoesNotExist:
            return JsonResponse({"error": f"Cliente con DNI {cliente_dni} no encontrado"}, status=404)
        except Vehiculo.DoesNotExist:
            return JsonResponse({"error": f"Vehículo con patente {vehiculo_patente} no encontrado"}, status=404)
        except Empleado.DoesNotExist:
            return JsonResponse({"error": f"Empleado con DNI {empleado_dni} no encontrado"}, status=404)
        except Reserva.DoesNotExist:
            return JsonResponse({"error": "Reserva no encontrada"}, status=404)
        except (ValueError, TypeError) as e:
            return JsonResponse({"error": f"Error en formato de datos: {str(e)}"}, status=400)
        
        # Crear el alquiler usando el método de clase
        try:
            with transaction.atomic():
                # Si viene de una reserva, confirmarla primero si está pendiente
                if reserva:
                    if reserva.estado == Reserva.ESTADO_PENDIENTE:
                        reserva.confirmar()
                    elif reserva.estado != Reserva.ESTADO_CONFIRMADA:
                        return JsonResponse({
                            "error": f"La reserva está en estado '{reserva.estado}'. Solo se pueden usar reservas pendientes o confirmadas."
                        }, status=400)
                
                # Crear el alquiler
                alquiler = Alquiler.crear_alquiler(
                    cliente=cliente,
                    vehiculo=vehiculo,
                    empleado=empleado,
                    reserva=reserva
                )
                
                # Completar la reserva después de crear el alquiler exitosamente
                if reserva:
                    reserva.completar()
                
                return JsonResponse({
                    "message": "Alquiler creado correctamente",
                    "alquiler": {
                        "id": alquiler.id,
                        "cliente": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                        "vehiculo": alquiler.vehiculo.patente,
                        "empleado": f"{alquiler.empleado.nombre} {alquiler.empleado.apellido}",
                        "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                        "activo": alquiler.esta_activo(),
                        "reserva_completada": reserva.id if reserva else None
                    }
                }, status=201)
                
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquiler_list(request):
    """Listar todos los alquileres"""
    try:
        alquileres = Alquiler.objects.select_related(
            'cliente', 'vehiculo', 'empleado', 'reserva'
        ).all()
        
        alquileres_list = [
            {
                "id": alquiler.id,
                "cliente_dni": alquiler.cliente.dni,
                "cliente_nombre": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                "vehiculo_patente": alquiler.vehiculo.patente,
                "vehiculo_modelo": f"{alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}",
                "empleado_dni": alquiler.empleado.dni,
                "empleado_nombre": f"{alquiler.empleado.nombre} {alquiler.empleado.apellido}",
                "reserva_id": alquiler.reserva.id if alquiler.reserva else None,
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "fecha_fin": alquiler.fecha_fin.isoformat() if alquiler.fecha_fin else None,
                "total_pago": str(alquiler.total_pago) if alquiler.total_pago else None,
                "activo": alquiler.esta_activo()
            }
            for alquiler in alquileres
        ]
        
        return JsonResponse({"alquileres": alquileres_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquiler_detail(request, id):
    """Obtener detalle de un alquiler específico"""
    try:
        alquiler = Alquiler.objects.select_related(
            'cliente', 'vehiculo', 'empleado', 'reserva'
        ).get(id=id)
        
        return JsonResponse({
            "alquiler": {
                "id": alquiler.id,
                "cliente_dni": alquiler.cliente.dni,
                "cliente_nombre": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                "cliente_telefono": alquiler.cliente.telefono,
                "vehiculo_patente": alquiler.vehiculo.patente,
                "vehiculo_marca": alquiler.vehiculo.marca,
                "vehiculo_modelo": alquiler.vehiculo.modelo,
                "vehiculo_color": alquiler.vehiculo.color,
                "empleado_dni": alquiler.empleado.dni,
                "empleado_nombre": f"{alquiler.empleado.nombre} {alquiler.empleado.apellido}",
                "reserva_id": alquiler.reserva.id if alquiler.reserva else None,
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "fecha_fin": alquiler.fecha_fin.isoformat() if alquiler.fecha_fin else None,
                "total_pago": str(alquiler.total_pago) if alquiler.total_pago else None,
                "activo": alquiler.esta_activo()
            }
        }, status=200)
        
    except Alquiler.DoesNotExist:
        return JsonResponse({"error": "Alquiler no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquileres_activos(request):
    """Obtener todos los alquileres activos (no finalizados)"""
    try:
        alquileres = Alquiler.objects.filter(
            fecha_fin__isnull=True
        ).select_related('cliente', 'vehiculo', 'empleado')
        
        alquileres_list = [
            {
                "id": alquiler.id,
                "cliente_dni": alquiler.cliente.dni,
                "cliente_nombre": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                "vehiculo_patente": alquiler.vehiculo.patente,
                "vehiculo_modelo": f"{alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}",
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "dias_alquilado": (timezone.now() - alquiler.fecha_inicio).days
            }
            for alquiler in alquileres
        ]
        
        return JsonResponse({"alquileres": alquileres_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def alquiler_finalizar(request, id):
    """Finalizar un alquiler activo (calcula automáticamente el total)"""
    try:
        with transaction.atomic():
            alquiler = Alquiler.objects.select_for_update().select_related('vehiculo').get(id=id)
            
            try:
                # Calcular información antes de finalizar
                dias = alquiler.calcular_dias_alquilado()
                total_calculado = alquiler.calcular_total()
                
                # Finalizar (calcula y guarda automáticamente)
                alquiler.finalizar()
                
                return JsonResponse({
                    "message": "Alquiler finalizado correctamente",
                    "alquiler": {
                        "id": alquiler.id,
                        "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                        "fecha_fin": alquiler.fecha_fin.isoformat(),
                        "dias_alquilado": dias,
                        "precio_por_dia": str(alquiler.vehiculo.precio_por_dia),
                        "total_pago": str(alquiler.total_pago),
                        "vehiculo_estado": alquiler.vehiculo.estado
                    }
                }, status=200)
                
            except ValidationError as e:
                return JsonResponse({"error": str(e)}, status=400)
            
    except Alquiler.DoesNotExist:
        return JsonResponse({"error": "Alquiler no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquiler_por_cliente(request, dni):
    """Obtener todos los alquileres de un cliente"""
    try:
        alquileres = Alquiler.objects.filter(
            cliente__dni=dni
        ).select_related('cliente', 'vehiculo', 'empleado').order_by('-fecha_inicio')
        
        if not alquileres.exists():
            return JsonResponse({
                "message": "No se encontraron alquileres para este cliente",
                "alquileres": []
            }, status=200)
        
        alquileres_list = [
            {
                "id": alquiler.id,
                "vehiculo_patente": alquiler.vehiculo.patente,
                "vehiculo_modelo": f"{alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}",
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "fecha_fin": alquiler.fecha_fin.isoformat() if alquiler.fecha_fin else None,
                "total_pago": str(alquiler.total_pago) if alquiler.total_pago else None,
                "activo": alquiler.esta_activo()
            }
            for alquiler in alquileres
        ]
        
        return JsonResponse({"alquileres": alquileres_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquiler_por_vehiculo(request, patente):
    """Obtener todos los alquileres de un vehículo"""
    try:
        alquileres = Alquiler.objects.filter(
            vehiculo__patente=patente
        ).select_related('cliente', 'vehiculo', 'empleado').order_by('-fecha_inicio')
        
        if not alquileres.exists():
            return JsonResponse({
                "message": "No se encontraron alquileres para este vehículo",
                "alquileres": []
            }, status=200)
        
        alquileres_list = [
            {
                "id": alquiler.id,
                "cliente_dni": alquiler.cliente.dni,
                "cliente_nombre": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "fecha_fin": alquiler.fecha_fin.isoformat() if alquiler.fecha_fin else None,
                "total_pago": str(alquiler.total_pago) if alquiler.total_pago else None,
                "activo": alquiler.esta_activo()
            }
            for alquiler in alquileres
        ]
        
        return JsonResponse({"alquileres": alquileres_list}, status=200)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
