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
def vehiculos_list(request):
    try:
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 5))
        patente_filtro = request.GET.get("patente", "").strip()
        estado_filtro = request.GET.get("estado", "").strip()
        
        offset = (page - 1) * page_size

        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()

        # Construir query con filtros
        where_clauses = []
        params = []
        
        if patente_filtro:
            where_clauses.append("patente LIKE ?")
            params.append(f"%{patente_filtro}%")
        
        if estado_filtro:
            where_clauses.append("estado = ?")
            params.append(estado_filtro)
        
        where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""

        # Contar total con filtros
        count_query = f"SELECT COUNT(*) FROM VEHICULOS{where_sql}"
        total = cursor.execute(count_query, params).fetchone()[0]

        # Obtener vehículos con filtros y paginación
        query = f"""
            SELECT patente, marca, modelo, color, precio_por_dia, estado
            FROM VEHICULOS
            {where_sql}
            LIMIT ? OFFSET ?
        """
        vehiculos = cursor.execute(query, params + [page_size, offset]).fetchall()

        conexion.close()

        resultado = [
            {
                "patente": v[0],
                "marca": v[1],
                "modelo": v[2],
                "color": v[3],
                "precio_por_dia": str(v[4]),
                "estado": v[5],
            }
            for v in vehiculos
        ]

        return JsonResponse({
            "vehiculos": resultado,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size,
        }, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

 

@require_http_methods(["GET"])
def vehiculo_patente(request, patente):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()
        vehiculo = cursor.execute(
            "SELECT patente, marca, modelo, color, precio_por_dia, estado FROM VEHICULOS WHERE patente = ?", (patente,)
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
                        "precio_por_dia": str(vehiculo[4]),
                        "estado": vehiculo[5],
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