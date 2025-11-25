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

        if not id_alquiler or not descripcion or not monto:
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

        if not descripcion and not monto:
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
# 4) LISTAR DAÑOS (se filtra por patente opcionalmente)
# -----------------------------------------------------------
@require_http_methods(["GET"])
def danios_list(request):
    """
    GET /danios/?page=1&page_size=5&patente=ABC123
    """
    try:
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 5))
        offset = (page - 1) * page_size
        patente = request.GET.get("patente", "").strip()

        # Query inicial
        danios_qs = Danio.objects.select_related('alquiler', 'alquiler__vehiculo')

        # Filtro por patente del vehículo asociado al alquiler
        if patente:
            danios_qs = danios_qs.filter(alquiler__vehiculo__patente__icontains=patente)

        total = danios_qs.count()

        # Aplicar paginación
        danios_page = danios_qs.order_by('id_danio')[offset:offset + page_size]

        lista_danios = [
            {
                "id_danio": d.id_danio,
                "id_alquiler": d.alquiler.id,
                "patente": d.alquiler.vehiculo.patente,
                "descripcion": d.descripcion,
                "monto": float(d.monto),
            }
            for d in danios_page
        ]

        total_pages = (total + page_size - 1) // page_size

        return JsonResponse({
            "danios": lista_danios,
            "total": total,
            "page": page,
            "total_pages": total_pages
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)