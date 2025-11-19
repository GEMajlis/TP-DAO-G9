from django.http import JsonResponse
from .models import Vehiculo
from .forms import VehiculoForm
import sqlite3
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# Create your views here.

@csrf_exempt
@require_http_methods(["POST"])
def vehiculo_create(request):
    try:
        data = json.loads(request.body)
        form = VehiculoForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse({"message": "Vehículo creado correctamente"}, status=201)
        else:
            return JsonResponse({"error": form.errors}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@require_http_methods(["GET"])
def vehiculo_patente(request, patente):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        vehiculo = cursor.execute(
            "SELECT * FROM VEHICULOS WHERE patente = ?", (patente,)
        ).fetchone()
        conexion.close()

        if not vehiculo:
            return JsonResponse({"error": "Vehículo no encontrado"}, status=404)

        return JsonResponse(
            {
                "vehiculos": [
                    {
                        "patente": vehiculo[0],
                        "marca": vehiculo[1],
                        "modelo": vehiculo[2],
                        "color": vehiculo[3],
                        "estado": vehiculo[4],
                    }
                ]
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["PUT"])
def vehiculo_edit(request, patente):
    try:
        # Obtén la instancia real de Django
        vehiculo = Vehiculo.objects.get(patente=patente)
        
        data = json.loads(request.body)
        form = VehiculoForm(data, instance=vehiculo)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"message": "Vehículo editado correctamente"}, status=200
            )
        else:
            return JsonResponse({"error": form.errors}, status=400)
    except Vehiculo.DoesNotExist:
        return JsonResponse({"error": "Vehículo no encontrado"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["DELETE"])
def vehiculo_delete(request, patente):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        vehiculo = cursor.execute(
            "SELECT * FROM VEHICULOS WHERE patente = ?", (patente,)
        ).fetchone()
        if not vehiculo:
            return JsonResponse({"error": "Vehículo no encontrado"}, status=404)
        cursor.execute("DELETE FROM VEHICULOS WHERE patente = ?", (vehiculo[0],))
        conexion.commit()
        return JsonResponse({"message": "Vehículo eliminado correctamente"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    finally:
        conexion.close()