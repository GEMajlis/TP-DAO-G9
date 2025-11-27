from .IEstrategiaReporte import IEstrategiaReporte, ejecutar_consulta

class VehiculosMasAlquiladosStrategy(IEstrategiaReporte):
    """Estrategia para el Reporte de Vehículos con más Alquileres."""
    def generar_reporte(self, **kwargs):
        query = """
            SELECT 
                V.patente, V.marca, V.modelo, V.color,
                COUNT(A.id) AS cantidad_alquileres
            FROM VEHICULOS V
            LEFT JOIN ALQUILERES A ON V.patente = A.vehiculo_patente
            GROUP BY V.patente, V.marca, V.modelo, V.color
            ORDER BY cantidad_alquileres DESC;
        """
        resultados = ejecutar_consulta(query)

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
        
        return {
            "nombre_reporte": "Vehiculos con Más Alquileres",
            "total_vehiculos": len(reporte),
            "reporte": reporte
        }