# mi_app/views.py

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

# Importaciones desde los archivos separados
from reportes.strategy.IEstrategiaReporte import IEstrategiaReporte
from reportes.strategy.VehiculosMasAlquilados import VehiculosMasAlquiladosStrategy
from reportes.strategy.FacturacionMensual import FacturacionMensualStrategy
from reportes.strategy.AlquileresPorPeriodo import AlquileresPorPeriodoStrategy


# --- Mapeo de la Estrategia (El Contexto usa un diccionario para seleccionar) ---
STRATEGY_MAP = {
    'vehiculos_mas_alquilados': VehiculosMasAlquiladosStrategy(),
    'facturacion_mensual': FacturacionMensualStrategy(),
    'alquileres_periodo': AlquileresPorPeriodoStrategy(),
}


@require_http_methods(["GET"])
def generar_reporte_strategy(request):
    """
    Endpoint único para generar cualquier tipo de reporte usando el Patrón Strategy.
    """
    tipo_reporte = request.GET.get('tipo', '').lower()
    estrategia: IEstrategiaReporte = STRATEGY_MAP.get(tipo_reporte)

    if not estrategia:
        tipos_disponibles = list(STRATEGY_MAP.keys())
        return JsonResponse({
            "error": "Tipo de reporte no válido.",
            "disponibles": tipos_disponibles
        }, status=400)

    try:
        # Extraer parámetros necesarios para la estrategia
        kwargs = {
            'fecha_inicio': request.GET.get('fecha_inicio'),
            'fecha_fin': request.GET.get('fecha_fin'),
        }

        # Delegar la ejecución
        datos_reporte = estrategia.generar_reporte(**kwargs)
        
        return JsonResponse(datos_reporte, status=200)

    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Error interno al generar el reporte: {str(e)}"}, status=500)