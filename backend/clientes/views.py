from django.http import JsonResponse
from .models import Cliente
from .forms import ClienteForm
from django.shortcuts import redirect
import sqlite3
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
import json



# Create your views here.

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@csrf_exempt
def cliente_create(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            form = ClienteForm(data)
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'Cliente creado correctamente'}, status=201)
            else:
                return JsonResponse({'error': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        form = ClienteForm()
    return HttpResponse(status=205)


def cliente_dni(request, dni):
    conexion = sqlite3.connect('db.sqlite3')
    cursor = conexion.cursor()
    cliente = cursor.execute("SELECT * FROM clientes_cliente WHERE dni = ?", (dni,)).fetchone()
    conexion.close()
    
    if not cliente:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    
    return JsonResponse({
        'clientes': [
            {
                'dni': cliente[0],
                'nombre': cliente[1],
                'apellido': cliente[2],
                'telefono': cliente[3],
            }
        ]
    })




def cliente_nombre(request, nombre):
    conexion = sqlite3.connect('db.sqlite3')
    cursor = conexion.cursor()
    cliente = cursor.execute("SELECT * FROM clientes_cliente WHERE nombre = ?", (nombre,)).fetchall()
    conexion.close()
    
    if not cliente:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    
    # Si hay múltiples clientes con ese nombre
    if len(cliente) >= 1:
        return JsonResponse({
            'clientes': [
                {
                    'dni': c[0],
                    'nombre': c[1],
                    'apellido': c[2],
                    'telefono': c[3],
                }
                for c in cliente
            ]
        })

@csrf_exempt
def cliente_edit(request, dni):
    try:
        # Obtén la instancia real de Django
        cliente = Cliente.objects.get(dni=dni)
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            form = ClienteForm(data, instance=cliente)
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'Cliente editado correctamente'}, status=200)
            else:
                return JsonResponse({'error': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        form = ClienteForm(instance=cliente)
    return HttpResponse(status=200)


@csrf_exempt
def cliente_delete(request, dni):
    try:
        conexion = sqlite3.connect('db.sqlite3')
        cursor = conexion.cursor()
        cliente = cursor.execute("SELECT * FROM clientes_cliente WHERE dni = ?", (dni,)).fetchone()
        conexion.close()
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)

    if request.method == "DELETE":
        conexion = sqlite3.connect('db.sqlite3')
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM clientes_cliente WHERE dni = ?", (dni,))
        conexion.commit()
        conexion.close()
        return JsonResponse({'message': 'Cliente eliminado correctamente'}, status=200)