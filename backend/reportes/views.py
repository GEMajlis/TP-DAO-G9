from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import sqlite3

# REPORTE DE VEHÍCULOS CON MÁS ALQUILERES
@require_http_methods(["GET"])
def reporte_vehiculos_mas_alquileres(request):
    try:
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()

        query = """
            SELECT 
                V.patente,
                V.marca,
                V.modelo,
                V.color,
                COUNT(A.id) AS cantidad_alquileres
            FROM VEHICULOS V
            LEFT JOIN ALQUILERES A ON V.patente = A.vehiculo_patente
            GROUP BY V.patente, V.marca, V.modelo, V.color
            ORDER BY cantidad_alquileres DESC;
        """

        resultados = cursor.execute(query).fetchall()
        conexion.close()

        reporte = [
            {
                "patente": r[0],
                "marca": r[1],
                "modelo": r[2],
                "color": r[3],
                "cantidad_alquileres": r[4],
            }
            for r in resultados
        ]

        return JsonResponse(
            {
                "total_vehiculos": len(reporte),
                "reporte": reporte
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# REPORTE DE FACTURACIÓN MENSUAL
@require_http_methods(["GET"])
def reporte_facturacion_mensual(request):
    try:
        mes_actual = datetime.now().month

        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()

        # Corregido: COALESCE para evitar valores NULL
        query = """
            SELECT 
                strftime('%m', fecha_inicio) AS mes,
                COALESCE(SUM(total_pago), 0) AS total
            FROM ALQUILERES
            GROUP BY mes
            ORDER BY mes;
        """

        resultados = cursor.execute(query).fetchall()
        conexion.close()

        nombres_meses = {
            "01": "Enero", "02": "Febrero", "03": "Marzo",
            "04": "Abril", "05": "Mayo", "06": "Junio",
            "07": "Julio", "08": "Agosto", "09": "Septiembre",
            "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
        }

        reporte = []
        for m in range(1, mes_actual + 1):
            num = f"{m:02d}"
            reporte.append({
                "mes": nombres_meses[num],
                "monto": 0
            })

        # Cargar datos reales
        for mes, total in resultados:
            mes_int = int(mes)
            if mes_int <= mes_actual:
                reporte[mes_int - 1]["monto"] = float(total or 0)

        return JsonResponse({"reporte_facturacion": reporte}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# REPORTE DE ALQUILERES POR PERÍODO
@require_http_methods(["GET"])
def reporte_alquileres_periodo(request, fecha_inicio, fecha_fin):
    try:
        # Validación de formato
        try:
            inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
            fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
        except ValueError:
            return JsonResponse(
                {"error": "Formato de fecha inválido. Use YYYY-MM-DD"},
                status=400
            )

        # Conexión y consulta SQL
        conexion = sqlite3.connect("db.sqlite3")
        cursor = conexion.cursor()

        query = """
            SELECT 
                id, cliente_dni, vehiculo_patente, empleado_dni,
                fecha_inicio, fecha_fin, total_pago
            FROM ALQUILERES
            WHERE DATE(fecha_inicio) BETWEEN DATE(?) AND DATE(?)
            ORDER BY fecha_inicio ASC
        """

        datos = cursor.execute(query, (fecha_inicio, fecha_fin)).fetchall()
        conexion.close()

        # Convertir resultado
        alquileres = []
        for a in datos:
            alquileres.append({
                "id_alquiler": a[0],
                "cliente_dni": a[1],
                "vehiculo_patente": a[2],
                "empleado_dni": a[3],
                "fecha_inicio": a[4],
                "fecha_fin": a[5],
                "total_pago": float(a[6]) if a[6] is not None else None
            })

        return JsonResponse(
            {
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "cantidad_alquileres": len(alquileres),
                "alquileres": alquileres
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)