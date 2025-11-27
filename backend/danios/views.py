from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from django.core.exceptions import ValidationError
from danios.models import Danio
from alquileres.models import Alquiler


# -----------------------------------------------------------
# 1) CREAR DAÑO
# -----------------------------------------------------------
@csrf_exempt
@require_http_methods(["POST"])
def danio_create(request):
    try:
        data = json.loads(request.body)

        id_alquiler = data.get("id_alquiler")
        descripcion = data.get("descripcion")
        monto = data.get("monto")

        if id_alquiler is None or descripcion is None or monto is None:
            return JsonResponse(
                {"error": "Se requieren id_alquiler, descripcion y monto"},
                status=400
            )

        # Validar alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        danio = Danio.objects.create(
            alquiler=alquiler,
            descripcion=descripcion,
            monto=monto
        )

        return JsonResponse(
            {
                "message": "Daño registrado correctamente",
                "id_danio": danio.id_danio,
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# -----------------------------------------------------------
# 2) LISTAR DAÑOS POR ALQUILER
# -----------------------------------------------------------
@require_http_methods(["GET"])
def danios_por_alquiler(request, id_alquiler):
    try:
        # Validar existencia del alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        danios = Danio.objects.filter(alquiler=alquiler)

        lista = []
        for d in danios:
            lista.append({
                "id_danio": d.id_danio,
                "descripcion": d.descripcion,
                "monto": float(d.monto),
            })

        return JsonResponse(
            {
                "id_alquiler": id_alquiler,
                "cantidad_danios": danios.count(),
                "danios": lista
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# -----------------------------------------------------------
# 3) ACTUALIZAR DAÑO
# -----------------------------------------------------------
@csrf_exempt
@require_http_methods(["PUT"])
def danio_update(request, id_alquiler, id_danio):
    try:
        data = json.loads(request.body)

        descripcion = data.get("descripcion")
        monto = data.get("monto")

        if descripcion is None and monto is None:
            return JsonResponse(
                {"error": "Se requiere descripcion o monto para actualizar"},
                status=400
            )

        # Validar alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        # Validar daño
        try:
            danio = Danio.objects.get(id_danio=id_danio, alquiler=alquiler)
        except Danio.DoesNotExist:
            return JsonResponse(
                {"error": f"No existe el daño {id_danio} para este alquiler"},
                status=404
            )

        # Actualizar valores
        if descripcion:
            danio.descripcion = descripcion
        if monto:
            danio.monto = monto

        danio.save()

        return JsonResponse(
            {
                "message": "Daño actualizado correctamente",
                "id_danio": danio.id_danio
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

# -----------------------------------------------------------
# 4) LISTAR TODOS LOS DAÑOS (activos e inactivos)
# -----------------------------------------------------------
@require_http_methods(["GET"])
def danios_todos(request):
    try:
        danios = Danio.objects.all().order_by("id_danio")

        lista = []

        for d in danios:
            # Obtener alquiler asociado
            alquiler = d.alquiler

            # Obtener cliente asociado al alquiler
            cliente = alquiler.cliente

            # Obtener vehículo asociado al alquiler
            vehiculo = alquiler.vehiculo

            lista.append({
                "id_danio": d.id_danio,
                "descripcion": d.descripcion,
                "monto": float(d.monto),

                # Información del alquiler
                "alquiler": {
                    "id_alquiler": alquiler.id,
                    "fecha_inicio": str(alquiler.fecha_inicio),
                    "fecha_fin": str(alquiler.fecha_fin) if alquiler.fecha_fin else None,
                    "estado": "activo" if alquiler.fecha_fin is None else "finalizado"
                },

                # Información del cliente
                "cliente": {
                    "dni": cliente.dni,
                    "nombre": cliente.nombre,
                    "apellido": cliente.apellido
                },

                # Información del vehículo
                "vehiculo": {
                    "patente": vehiculo.patente,
                    "marca": vehiculo.marca,
                    "modelo": vehiculo.modelo,
                    "color": vehiculo.color,
                    "precio_por_dia": float(vehiculo.precio_por_dia)
                }
            })

        return JsonResponse({"danios": lista}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)