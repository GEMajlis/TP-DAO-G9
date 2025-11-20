from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from empleados.models import Empleado
from vehiculos.models import Vehiculo
from mantenimiento.models import Mantenimiento
from django.core.exceptions import ValidationError


# -------------------------------------------------------------
# POST: Crear un mantenimiento
# -------------------------------------------------------------
@csrf_exempt
@require_http_methods(["POST"])
def mantenimiento_create(request):
    try:
        data = json.loads(request.body)

        dni = data.get("dni_empleado")
        patente = data.get("patente")

        if not dni or not patente:
            return JsonResponse(
                {"error": "Se requieren dni_empleado y patente"},
                status=400
            )

        # Buscar empleado
        try:
            empleado = Empleado.objects.get(dni=dni)
        except Empleado.DoesNotExist:
            return JsonResponse({"error": "Empleado no encontrado"}, status=404)

        # Buscar vehículo
        try:
            vehiculo = Vehiculo.objects.get(patente=patente)
        except Vehiculo.DoesNotExist:
            return JsonResponse({"error": "Vehículo no encontrado"}, status=404)

        # Crear mantenimiento mediante lógica del modelo
        mantenimiento = Mantenimiento.iniciar_mantenimiento(empleado, vehiculo)

        return JsonResponse(
            {
                "message": "Mantenimiento iniciado correctamente",
                "id_mantenimiento": mantenimiento.id_mantenimiento,
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



# -------------------------------------------------------------
# PUT: Finalizar un mantenimiento por PATENTE
# -------------------------------------------------------------
@csrf_exempt
@require_http_methods(["PUT"])
def mantenimiento_close(request, patente):
    try:
        # Buscar mantenimiento activo por patente
        try:
            mantenimiento = Mantenimiento.objects.get(
                vehiculo__patente=patente,
                fecha_fin__isnull=True  # Significa que sigue abierto
            )
        except Mantenimiento.DoesNotExist:
            return JsonResponse(
                {"error": f"No hay mantenimiento activo para la patente {patente}"},
                status=404
            )

        mantenimiento = Mantenimiento.finalizar_mantenimiento_por_id(
            mantenimiento.id_mantenimiento
        )

        return JsonResponse(
            {
                "message": "Mantenimiento finalizado correctamente",
                "id_mantenimiento": mantenimiento.id_mantenimiento,
                "patente": patente
            }
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# -------------------------------------------------------------
# GET: Obtener todos los mantenimientos activos
# -------------------------------------------------------------
@require_http_methods(["GET"])
def mantenimientos_activos(request):
    try:
        activos = Mantenimiento.objects.filter(fecha_fin__isnull=True)

        lista = []
        for m in activos:
            lista.append({
                "id_mantenimiento": m.id_mantenimiento,
                "dni_empleado": m.empleado.dni,
                "empleado_nombre": m.empleado.nombre,
                "empleado_apellido": m.empleado.apellido,
                "patente": m.vehiculo.patente,
                "fecha_inicio": str(m.fecha_inicio),
                "estado_vehiculo": m.vehiculo.estado
            })

        return JsonResponse({"mantenimientos_activos": lista}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
