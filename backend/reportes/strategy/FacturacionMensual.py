# reportes/FacturacionMensual.py

from datetime import datetime
from .IEstrategiaReporte import IEstrategiaReporte, ejecutar_consulta

class FacturacionMensualStrategy(IEstrategiaReporte):
    """Estrategia para el Reporte de Facturación Mensual."""
    def generar_reporte(self, **kwargs):
        mes_actual = datetime.now().month

        query = """
            SELECT 
                strftime('%m', fecha_inicio) AS mes,
                COALESCE(SUM(total_pago), 0) AS total
            FROM ALQUILERES
            GROUP BY mes
            ORDER BY mes;
        """
        resultados = ejecutar_consulta(query)

        nombres_meses = {
            f"{i:02d}": nombre for i, nombre in enumerate([
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ], 1)
        }

        # Inicializar el reporte hasta el mes actual
        reporte = [
            {"mes": nombres_meses[f"{m:02d}"], "monto": 0}
            for m in range(1, mes_actual + 1)
        ]

        # Cargar datos reales
        for mes, total in resultados:
            mes_int = int(mes)
            if 1 <= mes_int <= mes_actual:
                reporte[mes_int - 1]["monto"] = float(total or 0)

        return {
            "nombre_reporte": "Facturación Mensual",
            "reporte_facturacion": reporte
        }