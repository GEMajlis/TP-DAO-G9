from django.http import JsonResponse
from .models import Cliente
from .forms import ClienteForm
import sqlite3
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json


@csrf_exempt
@require_http_methods(["POST"])
def cliente_create(request):
    try:
        data = json.loads(request.body)
        form = ClienteForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse({"message": "Cliente creado correctamente"}, status=201)
        else:
            return JsonResponse({"error": form.errors}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def cliente_dni(request, dni):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        cliente = cursor.execute(
            "SELECT * FROM CLIENTES WHERE dni = ?", (dni,)
        ).fetchone()
        conexion.close()

        if not cliente:
            return JsonResponse({"error": "Cliente no encontrado"}, status=404)

        return JsonResponse(
            {
                "clientes": [
                    {
                        "dni": cliente[0],
                        "nombre": cliente[1],
                        "apellido": cliente[2],
                        "telefono": cliente[3],
                    }
                ]
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_http_methods(["GET"])
def cliente_nombre(request, nombre):
    conexion = sqlite3.connect("db.sqlite3")
    cursor = conexion.cursor()
    cliente = cursor.execute(
        "SELECT * FROM CLIENTES WHERE nombre = ?", (nombre,)
    ).fetchall()
    conexion.close()

    if not cliente:
        return JsonResponse({"error": "Cliente no encontrado"}, status=404)

    # Si hay múltiples clientes con ese nombre
    if len(cliente) >= 1:
        return JsonResponse(
            {
                "clientes": [
                    {
                        "dni": c[0],
                        "nombre": c[1],
                        "apellido": c[2],
                        "telefono": c[3],
                    }
                    for c in cliente
                ]
            }
        )


@csrf_exempt
@require_http_methods(["PUT"])
def cliente_edit(request, dni):
    try:
        # Obtén la instancia real de Django
        cliente = Cliente.objects.get(dni=dni)
        
        data = json.loads(request.body)
        form = ClienteForm(data, instance=cliente)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"message": "Cliente editado correctamente"}, status=200
            )
        else:
            return JsonResponse({"error": form.errors}, status=400)
    except Cliente.DoesNotExist:
        return JsonResponse({"error": "Cliente no encontrado"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["DELETE"])
def cliente_delete(request, dni):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        cliente = cursor.execute(
            "SELECT * FROM CLIENTES WHERE dni = ?", (dni,)
        ).fetchone()
        if not cliente:
            return JsonResponse({"error": "Cliente no encontrado"}, status=404)
        cursor.execute("DELETE FROM CLIENTES WHERE dni = ?", (cliente[0],))
        conexion.commit()
        return JsonResponse({"message": "Cliente eliminado correctamente"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    finally:
        conexion.close()
