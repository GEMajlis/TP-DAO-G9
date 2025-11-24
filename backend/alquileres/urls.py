from django.urls import path
from . import views

urlpatterns = [
    # CRUD básico
    path('', views.alquiler_list, name='alquiler_list'),
    path('nuevo/', views.alquiler_create, name='alquiler_create'),
    path('<int:id>/', views.alquiler_detail, name='alquiler_detail'),
    
    # Acciones
    path('<int:id>/finalizar/', views.alquiler_finalizar, name='alquiler_finalizar'),
    
    # Consultas
    path('activos/', views.alquileres_activos, name='alquileres_activos'),
    path('cliente/<int:dni>/', views.alquiler_por_cliente, name='alquiler_por_cliente'),
    path('vehiculo/<str:patente>/', views.alquiler_por_vehiculo, name='alquiler_por_vehiculo'),
]
