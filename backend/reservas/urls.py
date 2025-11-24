from django.urls import path
from . import views

urlpatterns = [
    # CRUD básico
    path('', views.reserva_list, name='reserva_list'),
    path('nuevo/', views.reserva_create, name='reserva_create'),
    path('<int:id>/', views.reserva_detail, name='reserva_detail'),
    path('<int:id>/editar/', views.reserva_update, name='reserva_update'),
    path('<int:id>/eliminar/', views.reserva_delete, name='reserva_delete'),
    
    # Acciones de estado
    path('<int:id>/confirmar/', views.reserva_confirmar, name='reserva_confirmar'),
    path('<int:id>/cancelar/', views.reserva_cancelar, name='reserva_cancelar'),
    
    # Conversión a alquiler
    path('<int:id>/convertir-a-alquiler/', views.convertir_a_alquiler, name='convertir_a_alquiler'),
    
    # Consultas especiales
    path('del-dia/', views.reservas_del_dia, name='reservas_del_dia'),
]
