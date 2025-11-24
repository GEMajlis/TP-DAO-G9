from django.http import JsonResponse
from .models import Empleado
from .forms import EmpleadoForm
import sqlite3
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json


@csrf_exempt
@require_http_methods(["POST"])
def empleado_create(request):
    try:
        data = json.loads(request.body)
        form = EmpleadoForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse({"message": "Empleado creado correctamente"}, status=201)
        else:
            return JsonResponse({"error": form.errors}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@require_http_methods(["GET"])
def get_empleados(request):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        empleados = cursor.execute(
            "SELECT * FROM EMPLEADOS"
        ).fetchall()
        conexion.close()

        empleados_list = []
        for empleado in empleados:
            empleados_list.append(
                {
                    "dni": empleado[0],
                    "nombre": empleado[1],
                    "apellido": empleado[2],
                }
            )

        return JsonResponse({"empleados": empleados_list})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# POR DNI
@require_http_methods(["GET"])
def empleado_dni(request, dni):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        empleado = cursor.execute(
            "SELECT * FROM EMPLEADOS WHERE dni = ?", (dni,)
        ).fetchone()
        conexion.close()

        if not empleado:
            return JsonResponse({"error": "Empleado no encontrado"}, status=404)

        return JsonResponse(
            {
                "empleados": [
                    {
                        "dni": empleado[0],
                        "nombre": empleado[1],
                        "apellido": empleado[2]
                    }
                ]
            },
            status=200
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# POR NOMBRE
@require_http_methods(["GET"])
def empleado_nombre(request, nombre):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        empleados = cursor.execute(
            "SELECT * FROM EMPLEADOS WHERE nombre LIKE ?", (f"%{nombre}%",)
        ).fetchall()
        conexion.close()

        if not empleados:
            return JsonResponse({"error": "Empleado no encontrado"}, status=404)

        return JsonResponse(
            {
                "empleados": [
                    {
                        "dni": e[0],
                        "nombre": e[1],
                        "apellido": e[2]
                    }
                    for e in empleados
                ]
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["PUT"])
def empleado_edit(request, dni):
    try:
        data = json.loads(request.body)
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        empleado = cursor.execute(
            "SELECT * FROM EMPLEADOS WHERE dni = ?", (dni,)
        ).fetchone()

        if not empleado:
            conexion.close()
            return JsonResponse({"error": "Empleado no encontrado"}, status=404)

        cursor.execute(
            "UPDATE EMPLEADOS SET nombre = ?, apellido = ? WHERE dni = ?",
            (data.get("nombre", empleado[1]), data.get("apellido", empleado[2]), dni),
        )
        conexion.commit()
        conexion.close()

        return JsonResponse({"message": "Empleado actualizado correctamente"})
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["DELETE"])
def empleado_delete(request, dni):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        empleado = cursor.execute(
            "SELECT * FROM EMPLEADOS WHERE dni = ?", (dni,)
        ).fetchone()

        if not empleado:
            conexion.close()
            return JsonResponse({"error": "Empleado no encontrado"}, status=404)

        cursor.execute("DELETE FROM EMPLEADOS WHERE dni = ?", (dni,))
        conexion.commit()
        conexion.close()

        return JsonResponse({"message": "Empleado eliminado correctamente"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)