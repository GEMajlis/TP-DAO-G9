"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from clientes import views as cliente_views
from vehiculos import views as vehiculo_views
from empleados import views as empleado_views
from mantenimiento import views as mantenimiento_views

urlpatterns = [
    path("admin/", admin.site.urls),
    # Clientes URLs
    path("clientes/nuevo/", cliente_views.cliente_create, name="cliente_create"),
    path("clientes/dni/<int:dni>/", cliente_views.cliente_dni, name="cliente_dni"),
    path("clientes/nombre/<str:nombre>/", cliente_views.cliente_nombre, name="cliente_nombre"),
    path("clientes/editar/<int:dni>/", cliente_views.cliente_edit, name="cliente_edit"),
    path("clientes/eliminar/<int:dni>/", cliente_views.cliente_delete, name="cliente_delete"),
    path("clientes/", cliente_views.get_clientes, name="get_clientes"),
    # Vehículos URLs
    path("vehiculos/nuevo/", vehiculo_views.vehiculo_create, name="vehiculo_create"),
    path("vehiculos/patente/<str:patente>/", vehiculo_views.vehiculo_patente, name="vehiculo_patente"),
    path("vehiculos/editar/<str:patente>/", vehiculo_views.vehiculo_edit, name="vehiculo_edit"),
    path("vehiculos/eliminar/<str:patente>/", vehiculo_views.vehiculo_delete, name="vehiculo_delete"),
    path("vehiculos/", vehiculo_views.get_vehiculos, name="get_vehiculos"),
    # Empleados URLs
    path("empleados/nuevo/", empleado_views.empleado_create, name="empleado_create"),
    path("empleados/", empleado_views.get_empleados, name="get_empleados"), 
    path("empleados/editar/<int:dni>/", empleado_views.empleado_edit, name="empleado_edit"),
    path("empleados/eliminar/<int:dni>/", empleado_views.empleado_delete, name="empleado_delete"),
    # Mantenimiento URLs
    path("mantenimientos/nuevo/", mantenimiento_views.mantenimiento_create, name="mantenimiento_create"),
    path("mantenimientos/finalizar/<str:patente>/", mantenimiento_views.mantenimiento_close, name="mantenimiento_finalizar"),
    path("mantenimientos/activos/", mantenimiento_views.mantenimientos_activos, name="mantenimientos_activos"),
    path("mantenimientos/<int:id_mantenimiento>/", mantenimiento_views.mantenimiento_por_id, name="mantenimiento_por_id"),
]