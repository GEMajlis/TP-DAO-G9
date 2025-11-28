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

        print("BODY CRUDO:", request.body)
        print("DATA PARSEADO:", data)
        print("TIPOS:", {k: type(v) for k, v in data.items()})
        
        # Obtener los valores del request
        cliente_dni = data.get('cliente_dni')
        vehiculo_patente = data.get('vehiculo_patente')
        empleado_dni = data.get('empleado_dni')
        reserva_id = data.get('reserva_id')
        
        # Validar que los campos requeridos estén presentes
        if not all([cliente_dni, vehiculo_patente, empleado_dni]):
            return JsonResponse({
                "error": "Faltan campos requeridos: cliente, vehiculo, empleado"
            }, status=400)
        
        # Convertir a los tipos correctos de manera segura
        try:
            # Convertir DNIs a entero (maneja int, str, float)
            if isinstance(cliente_dni, str):
                cliente_dni = int(float(cliente_dni))
            elif isinstance(cliente_dni, float):
                cliente_dni = int(cliente_dni)
            else:
                cliente_dni = int(cliente_dni)
                
            if isinstance(empleado_dni, str):
                empleado_dni = int(float(empleado_dni))
            elif isinstance(empleado_dni, float):
                empleado_dni = int(empleado_dni)
            else:
                empleado_dni = int(empleado_dni)
            
            # La patente siempre debe ser string
            vehiculo_patente = str(vehiculo_patente)
            
        except (ValueError, TypeError) as e:
            return JsonResponse({
                "error": f"Error en formato de datos: {str(e)}. "
                        f"Cliente: {type(cliente_dni)}, Empleado: {type(empleado_dni)}"
            }, status=400)
        
        print(f"DNI Cliente: {cliente_dni} (tipo: {type(cliente_dni)})")
        print(f"DNI Empleado: {empleado_dni} (tipo: {type(empleado_dni)})")
        print(f"Patente: {vehiculo_patente} (tipo: {type(vehiculo_patente)})")
        
        # Obtener los objetos relacionados
        try:
            cliente = Cliente.objects.get(dni=cliente_dni)
            print(f"Cliente encontrado: {cliente}")
        except Cliente.DoesNotExist:
            return JsonResponse({
                "error": f"Cliente con DNI {cliente_dni} no encontrado"
            }, status=404)
        
        try:
            vehiculo = Vehiculo.objects.get(patente=vehiculo_patente)
            print(f"Vehículo encontrado: {vehiculo}")
        except Vehiculo.DoesNotExist:
            return JsonResponse({
                "error": f"Vehículo con patente {vehiculo_patente} no encontrado"
            }, status=404)
        
        try:
            empleado = Empleado.objects.get(dni=empleado_dni)
            print(f"Empleado encontrado: {empleado}")
        except Empleado.DoesNotExist:
            return JsonResponse({
                "error": f"Empleado con DNI {empleado_dni} no encontrado"
            }, status=404)
        
        # Manejar reserva opcional
        reserva = None
        if reserva_id:
            try:
                # No bloqueamos aún, solo verificamos existencia
                reserva = Reserva.objects.get(id=reserva_id)
            except Reserva.DoesNotExist:
                return JsonResponse({
                    "error": f"Reserva con ID {reserva_id} no encontrada"
                }, status=404)
        
        # Crear el alquiler usando el método de clase
        try:
            with transaction.atomic():
                # Si viene de una reserva, gestionar transición de estado:
                # PENDIENTE → CONFIRMADA (al crear el alquiler)
                # CONFIRMADA → COMPLETADA (al finalizar el alquiler)
                if reserva:
                    # Bloquear la reserva para evitar condiciones de carrera
                    reserva = Reserva.objects.select_for_update().get(id=reserva.id)
                    
                    if reserva.estado == Reserva.ESTADO_PENDIENTE:
                        # Transición: PENDIENTE → CONFIRMADA
                        reserva.confirmar()
                    elif reserva.estado != Reserva.ESTADO_CONFIRMADA:
                        return JsonResponse({
                            "error": f"La reserva está en estado '{reserva.estado}'. "
                                   f"Solo se pueden usar reservas pendientes o confirmadas."
                        }, status=400)
                
                # Crear el alquiler
                alquiler = Alquiler.crear_alquiler(
                    cliente=cliente,
                    vehiculo=vehiculo,
                    empleado=empleado,
                    reserva=reserva
                )
                
                # NO completar la reserva aquí
                # La reserva se completará cuando se finalice el alquiler
                
                return JsonResponse({
                    "message": "Alquiler creado correctamente",
                    "alquiler": {
                        "id": alquiler.id,
                        "cliente": f"{alquiler.cliente.nombre} {alquiler.cliente.apellido}",
                        "cliente_dni": alquiler.cliente.dni,
                        "vehiculo": alquiler.vehiculo.patente,
                        "empleado": f"{alquiler.empleado.nombre} {alquiler.empleado.apellido}",
                        "empleado_dni": alquiler.empleado.dni,
                        "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                        "activo": alquiler.esta_activo(),
                        "reserva_completada": reserva.id if reserva else None
                    }
                }, status=201)
                
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
            
    except json.JSONDecodeError as e:
        return JsonResponse({
            "error": f"JSON inválido: {str(e)}"
        }, status=400)
    except Exception as e:
        import traceback
        return JsonResponse({
            "error": f"Error inesperado: {str(e)}",
            "traceback": traceback.format_exc()
        }, status=500)


@require_http_methods(["GET"])
def alquiler_list(request):
    """Listar todos los alquileres con filtros y paginación"""
    try:
        # Parámetros de paginación
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 5))
        offset = (page - 1) * page_size

        # Filtros opcionales
        patente_filtro = request.GET.get("patente", "").strip()
        estado_filtro = request.GET.get("estado", "").strip() 

        # Query inicial
        alquileres_qs = Alquiler.objects.select_related(
            'cliente', 'vehiculo', 'empleado', 'reserva'
        )

        # Filtrar por patente
        if patente_filtro:
            alquileres_qs = alquileres_qs.filter(vehiculo__patente__icontains=patente_filtro)

        # Filtrar por estado
        if estado_filtro == "Activo":
            alquileres_qs = alquileres_qs.filter(fecha_fin__isnull=True)
        elif estado_filtro == "Finalizado":
            alquileres_qs = alquileres_qs.filter(fecha_fin__isnull=False)

        total = alquileres_qs.count()

        # Aplicar paginación
        alquileres = alquileres_qs.order_by('-fecha_inicio')[offset:offset + page_size]

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

        return JsonResponse({
            "alquileres": alquileres_list,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def alquiler_detail(request, id):
    """Obtener detalle de un alquiler específico con multas y daños"""
    try:
        alquiler = Alquiler.objects.select_related(
            'cliente', 'vehiculo', 'empleado', 'reserva'
        ).prefetch_related('multa_set', 'danio_set').get(id=id)
        
        # Obtener multas asociadas
        multas = [
            {
                "id": multa.id_multa,
                "motivo": multa.motivo,
                "monto": str(multa.monto)
            }
            for multa in alquiler.multa_set.all()
        ]
        
        # Obtener daños asociados
        danios = [
            {
                "id": danio.id_danio,
                "descripcion": danio.descripcion,
                "monto": str(danio.monto)
            }
            for danio in alquiler.danio_set.all()
        ]
        
        # Calcular totales para el desglose
        dias = alquiler.calcular_dias_alquilado(alquiler.fecha_fin)
        costo_base = float(alquiler.vehiculo.precio_por_dia) * dias
        total_multas = sum(float(m.monto) for m in alquiler.multa_set.all())
        total_danios = sum(float(d.monto) for d in alquiler.danio_set.all())
        
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
                "vehiculo_precio_dia": str(alquiler.vehiculo.precio_por_dia),
                "empleado_dni": alquiler.empleado.dni,
                "empleado_nombre": f"{alquiler.empleado.nombre} {alquiler.empleado.apellido}",
                "reserva_id": alquiler.reserva.id if alquiler.reserva else None,
                "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                "fecha_fin": alquiler.fecha_fin.isoformat() if alquiler.fecha_fin else None,
                "total_pago": str(alquiler.total_pago) if alquiler.total_pago else None,
                "activo": alquiler.esta_activo(),
                "multas": multas,
                "danios": danios,
                "desglose": {
                    "dias": dias,
                    "costo_base": str(costo_base),
                    "total_multas": str(total_multas),
                    "total_danios": str(total_danios)
                }
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
            alquiler = Alquiler.objects.select_for_update().select_related('vehiculo', 'reserva').get(id=id)
            
            try:
                # Calcular información antes de finalizar
                dias = alquiler.calcular_dias_alquilado()
                total_calculado = alquiler.calcular_total()
                
                # Finalizar (calcula y guarda automáticamente)
                alquiler.finalizar()
                
                # Transición: CONFIRMADA → COMPLETADA
                # Si el alquiler tiene una reserva asociada, marcarla como completada
                if alquiler.reserva:
                    reserva = Reserva.objects.select_for_update().get(id=alquiler.reserva.id)
                    if reserva.estado == Reserva.ESTADO_CONFIRMADA:
                        reserva.completar()
                
                return JsonResponse({
                    "message": "Alquiler finalizado correctamente",
                    "alquiler": {
                        "id": alquiler.id,
                        "fecha_inicio": alquiler.fecha_inicio.isoformat(),
                        "fecha_fin": alquiler.fecha_fin.isoformat(),
                        "dias_alquilado": dias,
                        "precio_por_dia": str(alquiler.vehiculo.precio_por_dia),
                        "total_pago": str(alquiler.total_pago),
                        "vehiculo_estado": alquiler.vehiculo.estado,
                        "reserva_completada": alquiler.reserva.id if alquiler.reserva else None
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
