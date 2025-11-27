from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from django.core.exceptions import ValidationError
from multas.models import Multa
from alquileres.models import Alquiler


@csrf_exempt
@require_http_methods(["POST"])
def multa_create(request):
    try:
        data = json.loads(request.body)

        id_alquiler = data.get("alquiler")
        motivo = data.get("motivo")
        monto = data.get("monto")

        if not id_alquiler or not motivo or not monto:
            return JsonResponse(
                {"error": "Se requieren id_alquiler, motivo y monto"},
                status=400
            )

        # Buscar el alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        multa = Multa.objects.create(
            alquiler=alquiler,
            motivo=motivo,
            monto=monto
        )

        return JsonResponse(
            {
                "message": "Multa creada correctamente",
                "id_multa": multa.id_multa,
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def multas_por_alquiler(request, id_alquiler):
    try:
        # Verificar que exista el alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        multas = Multa.objects.filter(alquiler=alquiler)

        lista = []
        for m in multas:
            lista.append({
                "id_multa": m.id_multa,
                "motivo": m.motivo,
                "monto": float(m.monto),
            })

        return JsonResponse(
            {
                "id_alquiler": id_alquiler,
                "cantidad_multas": multas.count(),
                "multas": lista
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["PUT"])
def multa_update(request, id_alquiler, id_multa):
    try:
        data = json.loads(request.body)

        motivo = data.get("motivo")
        monto = data.get("monto")

        if not motivo and not monto:
            return JsonResponse(
                {"error": "Se requiere motivo o monto para actualizar"},
                status=400
            )

        # Verificar alquiler
        try:
            alquiler = Alquiler.objects.get(pk=id_alquiler)
        except Alquiler.DoesNotExist:
            return JsonResponse({"error": "Alquiler no encontrado"}, status=404)

        # Verificar multa
        try:
            multa = Multa.objects.get(id_multa=id_multa, alquiler=alquiler)
        except Multa.DoesNotExist:
            return JsonResponse(
                {"error": f"No existe la multa {id_multa} para este alquiler"},
                status=404
            )

        if motivo:
            multa.motivo = motivo
        if monto:
            multa.monto = monto

        multa.save()

        return JsonResponse(
            {
                "message": "Multa actualizada correctamente",
                "id_multa": multa.id_multa
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

# GET DE TODAS LAS MULTAS (ALQUILERES ACTIVOS E INACTIVOS)
@require_http_methods(["GET"])
def multas_todas(request):
    try:
        multas = Multa.objects.all().order_by("id_multa")

        lista = []

        for multa in multas:
            # Obtener el alquiler asociado
            alquiler = multa.alquiler

            # Obtener cliente del alquiler
            cliente = alquiler.cliente

            # Obtener vehículo del alquiler
            vehiculo = alquiler.vehiculo

            lista.append({
                "id_multa": multa.id_multa,
                "motivo": multa.motivo,
                "monto": float(multa.monto),

                "alquiler": {
                    "id_alquiler": alquiler.id,
                    "fecha_inicio": str(alquiler.fecha_inicio),
                    "fecha_fin": str(alquiler.fecha_fin) if alquiler.fecha_fin else None
                },

                "cliente": {
                    "dni": cliente.dni,
                    "nombre": cliente.nombre,
                    "apellido": cliente.apellido
                },

                "vehiculo": {
                    "patente": vehiculo.patente,
                    "marca": vehiculo.marca,
                    "modelo": vehiculo.modelo,
                    "color": vehiculo.color,
                    "precio_por_dia": float(vehiculo.precio_por_dia)
                }
            })

        return JsonResponse({"multas": lista}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
