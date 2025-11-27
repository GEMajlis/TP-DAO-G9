# reportes/AlquileresPorPeriodo.py

from datetime import datetime
from .IEstrategiaReporte import IEstrategiaReporte, ejecutar_consulta

class AlquileresPorPeriodoStrategy(IEstrategiaReporte):
    """Estrategia para el Reporte de Alquileres por Período."""
    def generar_reporte(self, **kwargs):
        fecha_inicio = kwargs.get('fecha_inicio')
        fecha_fin = kwargs.get('fecha_fin')

        if not fecha_inicio or not fecha_fin:
             raise ValueError("Las fechas de inicio y fin son obligatorias para este reporte.")

        # Validación de formato de fecha
        try:
            datetime.strptime(fecha_inicio, "%Y-%m-%d")
            datetime.strptime(fecha_fin, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Formato de fecha inválido. Use YYYY-MM-DD")
            
        query = """
            SELECT 
                id, cliente_dni, vehiculo_patente, empleado_dni,
                fecha_inicio, fecha_fin, total_pago
            FROM ALQUILERES
            WHERE DATE(fecha_inicio) BETWEEN DATE(?) AND DATE(?)
            ORDER BY fecha_inicio ASC
        """
        datos = ejecutar_consulta(query, (fecha_inicio, fecha_fin))

        alquileres = [
            {
                "id_alquiler": a[0],
                "cliente_dni": a[1],
                "vehiculo_patente": a[2],
                "empleado_dni": a[3],
                "fecha_inicio": a[4],
                "fecha_fin": a[5],
                "total_pago": float(a[6]) if a[6] is not None else None
            }
            for a in datos
        ]

        return {
            "nombre_reporte": "Alquileres por Período",
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "cantidad_alquileres": len(alquileres),
            "alquileres": alquileres
        }