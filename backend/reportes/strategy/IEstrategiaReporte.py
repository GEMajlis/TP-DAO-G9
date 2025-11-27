# reportes/IReporteStrategy.py

from abc import ABC, abstractmethod
import sqlite3


# INTERFAZ (IEstrategia)
class IEstrategiaReporte(ABC):
    """
    Define la interfaz común para todas las estrategias de reportes.
    """
    @abstractmethod
    def generar_reporte(self, **kwargs):
        """
        Método abstracto para obtener y formatear los datos del reporte.
        Debe devolver un diccionario con los datos listos para JsonResponse.
        """
        pass


# Conexión a Base de Datos 
DATABASE_NAME = "db.sqlite3"

def ejecutar_consulta(query, params=()):
    """Función auxiliar para ejecutar consultas SQLite."""
    conexion = sqlite3.connect(DATABASE_NAME)
    cursor = conexion.cursor()
    try:
        cursor.execute(query, params)
        resultados = cursor.fetchall()
        conexion.close()
        return resultados
    except Exception as e:
        conexion.close()
        raise e