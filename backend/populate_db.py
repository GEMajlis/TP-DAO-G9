#!/usr/bin/env python
"""
Script para poblar la base de datos con datos de prueba
Período: Julio - Noviembre 2025
Horario: Argentina (UTC-3)

Ejecutar desde el directorio backend:
    python populate_db.py
"""

import os
import sys
import django
import random
import sqlite3
from datetime import datetime, timedelta, date
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar modelos después de configurar Django
from clientes.models import Cliente
from empleados.models import Empleado
from vehiculos.models import Vehiculo
from reservas.models import Reserva
from alquileres.models import Alquiler
from mantenimiento.models import Mantenimiento
from multas.models import Multa
from danios.models import Danio


# ============================================================================
# DATOS DE REFERENCIA PARA ARGENTINA
# ============================================================================

NOMBRES_MASCULINOS = [
    'Juan', 'Carlos', 'Miguel', 'Luis', 'Jorge', 'Martín', 'Diego', 'Fernando',
    'Sebastián', 'Alejandro', 'Pablo', 'Daniel', 'Matías', 'Nicolás', 'Facundo',
    'Gonzalo', 'Maximiliano', 'Lucas', 'Agustín', 'Ezequiel', 'Gabriel', 'Rodrigo'
]

NOMBRES_FEMENINOS = [
    'María', 'Ana', 'Laura', 'Sofía', 'Valentina', 'Camila', 'Lucía', 'Martina',
    'Carolina', 'Paula', 'Florencia', 'Gabriela', 'Natalia', 'Verónica', 'Andrea',
    'Cecilia', 'Mariana', 'Daniela', 'Victoria', 'Romina', 'Julieta', 'Belén'
]

APELLIDOS = [
    'González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'García', 'Pérez',
    'Sánchez', 'Romero', 'Díaz', 'Torres', 'Álvarez', 'Ruiz', 'Gómez', 'Hernández',
    'Ramírez', 'Moreno', 'Giménez', 'Castro', 'Benítez', 'Acosta', 'Silva', 'Medina',
    'Vargas', 'Rojas', 'Molina', 'Flores', 'Pereyra', 'Domínguez', 'Cabrera'
]

VEHICULOS_DATA = [
    {'marca': 'Fiat', 'modelo': 'Cronos', 'colores': ['Blanco', 'Gris', 'Negro', 'Rojo'], 'precio': 8500},
    {'marca': 'Fiat', 'modelo': 'Argo', 'colores': ['Blanco', 'Azul', 'Gris'], 'precio': 8000},
    {'marca': 'Volkswagen', 'modelo': 'Gol', 'colores': ['Blanco', 'Negro', 'Gris'], 'precio': 7000},
    {'marca': 'Volkswagen', 'modelo': 'Polo', 'colores': ['Gris', 'Rojo', 'Blanco'], 'precio': 9500},
    {'marca': 'Ford', 'modelo': 'Focus', 'colores': ['Negro', 'Blanco', 'Azul'], 'precio': 10000},
    {'marca': 'Ford', 'modelo': 'Fiesta', 'colores': ['Rojo', 'Blanco', 'Gris'], 'precio': 8500},
    {'marca': 'Chevrolet', 'modelo': 'Onix', 'colores': ['Blanco', 'Negro', 'Gris'], 'precio': 8000},
    {'marca': 'Chevrolet', 'modelo': 'Cruze', 'colores': ['Negro', 'Blanco', 'Gris'], 'precio': 11000},
    {'marca': 'Toyota', 'modelo': 'Corolla', 'colores': ['Blanco', 'Gris', 'Negro'], 'precio': 12500},
    {'marca': 'Toyota', 'modelo': 'Etios', 'colores': ['Blanco', 'Rojo', 'Gris'], 'precio': 7500},
    {'marca': 'Renault', 'modelo': 'Sandero', 'colores': ['Blanco', 'Negro', 'Azul'], 'precio': 7000},
    {'marca': 'Renault', 'modelo': 'Logan', 'colores': ['Gris', 'Blanco', 'Negro'], 'precio': 7200},
    {'marca': 'Peugeot', 'modelo': '208', 'colores': ['Rojo', 'Blanco', 'Negro'], 'precio': 8800},
    {'marca': 'Peugeot', 'modelo': '2008', 'colores': ['Gris', 'Blanco', 'Negro'], 'precio': 10500},
    {'marca': 'Citroën', 'modelo': 'C4', 'colores': ['Negro', 'Blanco', 'Gris'], 'precio': 9500},
]

MOTIVOS_MULTAS = [
    'Devolución tardía - 2 días de demora',
    'Devolución tardía - 3 días de demora',
    'Devolución tardía - 1 día de demora',
    'Infracción velocidad detectada - Ruta 9',
    'Infracción velocidad - Autopista Rosario-Córdoba',
    'Estacionamiento prohibido - Multa municipal',
    'Tanque sin llenar al devolver',
    'Falta de combustible - Nivel muy bajo',
    'Incumplimiento horario devolución',
    'Exceso de kilometraje acordado',
]

DESCRIPCIONES_DANIOS = [
    'Rayón lateral derecho - Puerta trasera',
    'Rayón lateral izquierdo - Puerta delantera',
    'Espejo retrovisor derecho roto',
    'Espejo retrovisor izquierdo quebrado',
    'Aboladura en capot',
    'Aboladura en baúl',
    'Parabrisas astillado - Impacto piedra',
    'Vidrio lateral trasero roto',
    'Guardabarros delantero abollado',
    'Paragolpes trasero rayado',
    'Paragolpes delantero con fisura',
    'Tapa de combustible rota',
    'Llanta rayada - Rueda delantera',
    'Manija de puerta rota',
]

CODIGOS_AREA = ['011', '341', '351', '343', '342', '261', '221', '223', '264', '299']


# ============================================================================
# FUNCIONES AUXILIARES
# ============================================================================

def generar_dni():
    """Genera un DNI argentino válido de 8 dígitos"""
    return random.randint(10000000, 45999999)

def generar_telefono():
    """Genera un número de teléfono argentino"""
    codigo_area = random.choice(CODIGOS_AREA)
    if codigo_area == '011':
        numero = random.randint(30000000, 69999999)  # 8 dígitos para CABA
    else:
        numero = random.randint(4000000, 9999999)    # 7 dígitos para provincia
    return int(f"{codigo_area}{numero}")

def generar_patente():
    """Genera una patente argentina formato nuevo AA123BB"""
    letras1 = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2))
    numeros = ''.join(random.choices('0123456789', k=3))
    letras2 = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2))
    return f"{letras1}{numeros}{letras2}"

def generar_nombre_completo():
    """Genera un nombre y apellido aleatorio"""
    es_masculino = random.choice([True, False])
    if es_masculino:
        nombre = random.choice(NOMBRES_MASCULINOS)
    else:
        nombre = random.choice(NOMBRES_FEMENINOS)
    apellido = random.choice(APELLIDOS)
    return nombre, apellido

def datetime_argentina(year, month, day, hour=0, minute=0, second=0):
    """Crea un datetime y lo formatea para SQLite"""
    return datetime(year, month, day, hour, minute, second).strftime('%Y-%m-%d %H:%M:%S')

def fecha_aleatoria_en_mes(year, month):
    """Genera una fecha aleatoria dentro de un mes específico"""
    if month == 11:
        # Noviembre: del 1 al 24 (no generar después de la fecha actual)
        dia = random.randint(1, 24)
    else:
        # Otros meses: del 1 al 28 para evitar problemas con febrero
        if month in [1, 3, 5, 7, 8, 10, 12]:
            dia = random.randint(1, 30)
        elif month == 2:
            dia = random.randint(1, 28)
        else:
            dia = random.randint(1, 30)
    
    hora = random.randint(8, 20)
    minuto = random.randint(0, 59)
    return datetime_argentina(year, month, dia, hora, minuto, 0)


# ============================================================================
# FUNCIÓN DE LIMPIEZA
# ============================================================================

def limpiar_base_datos():
    """Elimina todos los registros de la base de datos en orden correcto"""
    print("\n" + "="*70)
    print("LIMPIANDO BASE DE DATOS")
    print("="*70)
    
    # Orden: de dependientes a independientes
    modelos = [
        ('Daños', Danio),
        ('Multas', Multa),
        ('Mantenimientos', Mantenimiento),
        ('Alquileres', Alquiler),
        ('Reservas', Reserva),
        ('Vehículos', Vehiculo),
        ('Clientes', Cliente),
        ('Empleados', Empleado),
    ]
    
    for nombre, modelo in modelos:
        count = modelo.objects.count()
        if count > 0:
            modelo.objects.all().delete()
            print(f"✓ {nombre}: {count} registros eliminados")
        else:
            print(f"○ {nombre}: ya estaba vacío")
    
    print("\n✓ Base de datos limpiada correctamente\n")


# ============================================================================
# FUNCIÓN PARA POBLAR DATOS MAESTROS
# ============================================================================

def poblar_datos_maestros():
    """Crea vehículos, empleados y clientes"""
    print("="*70)
    print("POBLANDO DATOS MAESTROS")
    print("="*70)
    
    # ========== VEHÍCULOS ==========
    print("\n📦 Creando vehículos...")
    vehiculos = []
    patentes_usadas = set()
    
    for vehiculo_data in VEHICULOS_DATA:
        # Generar patente única
        while True:
            patente = generar_patente()
            if patente not in patentes_usadas:
                patentes_usadas.add(patente)
                break
        
        color = random.choice(vehiculo_data['colores'])
        precio = Decimal(str(vehiculo_data['precio']))
        
        vehiculo = Vehiculo(
            patente=patente,
            marca=vehiculo_data['marca'],
            modelo=vehiculo_data['modelo'],
            color=color,
            precio_por_dia=precio,
            estado='disponible'
        )
        vehiculos.append(vehiculo)
    
    Vehiculo.objects.bulk_create(vehiculos)
    print(f"   ✓ {len(vehiculos)} vehículos creados")
    
    # ========== EMPLEADOS ==========
    print("\n👥 Creando empleados...")
    empleados = []
    dnis_usados = set()
    
    for _ in range(7):
        while True:
            dni = generar_dni()
            if dni not in dnis_usados:
                dnis_usados.add(dni)
                break
        
        nombre, apellido = generar_nombre_completo()
        
        empleado = Empleado(
            dni=dni,
            nombre=nombre,
            apellido=apellido
        )
        empleados.append(empleado)
    
    Empleado.objects.bulk_create(empleados)
    print(f"   ✓ {len(empleados)} empleados creados")
    
    # ========== CLIENTES ==========
    print("\n👤 Creando clientes...")
    clientes = []
    
    for _ in range(35):
        while True:
            dni = generar_dni()
            if dni not in dnis_usados:
                dnis_usados.add(dni)
                break
        
        nombre, apellido = generar_nombre_completo()
        telefono = generar_telefono()
        
        cliente = Cliente(
            dni=dni,
            nombre=nombre,
            apellido=apellido,
            telefono=telefono
        )
        clientes.append(cliente)
    
    Cliente.objects.bulk_create(clientes)
    print(f"   ✓ {len(clientes)} clientes creados")
    
    print("\n✓ Datos maestros poblados correctamente\n")
    
    return vehiculos, empleados, clientes


# ============================================================================
# FUNCIÓN PARA POBLAR RESERVAS Y ALQUILERES
# ============================================================================

def poblar_reservas_y_alquileres(vehiculos_list, empleados_list, clientes_list):
    """Crea reservas y alquileres históricos con distribución concentrada"""
    print("="*70)
    print("POBLANDO RESERVAS Y ALQUILERES")
    print("="*70)
    
    # Distribución por mes (porcentajes)
    distribucion = {
        7: 0.10,   # Julio: 10%
        8: 0.12,   # Agosto: 12%
        9: 0.32,   # Septiembre: 32%
        10: 0.32,  # Octubre: 32%
        11: 0.14,  # Noviembre: 14%
    }
    
    total_reservas = 70
    total_alquileres = 45
    
    # ========== RESERVAS ==========
    print("\n📅 Creando reservas...")
    reservas_data = []
    reservas_por_mes = {}
    
    for mes, porcentaje in distribucion.items():
        cantidad = int(total_reservas * porcentaje)
        reservas_por_mes[mes] = cantidad
    
    # Ajustar el último mes para llegar al total exacto
    diferencia = total_reservas - sum(reservas_por_mes.values())
    reservas_por_mes[11] += diferencia
    
    # Crear lista de datos para insertar
    next_id = 1
    
    for mes, cantidad in reservas_por_mes.items():
        for _ in range(cantidad):
            cliente = random.choice(clientes_list)
            vehiculo = random.choice(vehiculos_list)
            
            # Fecha de reserva
            fecha_reserva_dt = fecha_aleatoria_en_mes(2025, mes)
            
            # Fechas de inicio y fin (3-10 días)
            dias_adelantados = random.randint(1, 10)
            fecha_inicio_dt = datetime.strptime(fecha_reserva_dt, '%Y-%m-%d %H:%M:%S') + timedelta(days=dias_adelantados)
            fecha_inicio = fecha_inicio_dt.strftime('%Y-%m-%d')
            
            duracion = random.randint(3, 10)
            fecha_fin_dt = fecha_inicio_dt + timedelta(days=duracion)
            fecha_fin = fecha_fin_dt.strftime('%Y-%m-%d')
            
            # Estados: 60% completada, 20% confirmada, 10% cancelada, 10% expirada
            rand = random.random()
            if rand < 0.60:
                estado = 'completada'
            elif rand < 0.80:
                estado = 'confirmada'
            elif rand < 0.90:
                estado = 'cancelada'
            else:
                estado = 'expirada'
            
            reservas_data.append((
                next_id,
                cliente.dni,
                vehiculo.patente,
                fecha_reserva_dt,
                fecha_inicio,
                fecha_fin,
                estado
            ))
            next_id += 1
    
    # Insertar con SQL directo para evitar auto_now_add
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.executemany(
        """INSERT INTO RESERVAS (id, cliente_dni, vehiculo_patente, fecha_reserva, fecha_inicio, fecha_fin, estado)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        reservas_data
    )
    conn.commit()
    conn.close()
    
    print(f"   ✓ {len(reservas_data)} reservas creadas")
    print(f"   📊 Distribución: Jul={reservas_por_mes[7]}, Ago={reservas_por_mes[8]}, "
          f"Sep={reservas_por_mes[9]}, Oct={reservas_por_mes[10]}, Nov={reservas_por_mes[11]}")
    
    # ========== ALQUILERES ==========
    print("\n🚗 Creando alquileres...")
    
    # Obtener reservas completadas de la base de datos
    reservas_completadas = list(Reserva.objects.filter(estado='completada'))
    
    # Seleccionar aleatoriamente cuáles tendrán alquiler
    reservas_con_alquiler = random.sample(
        reservas_completadas, 
        min(total_alquileres, len(reservas_completadas))
    )
    
    alquileres_data = []
    next_alquiler_id = 1
    
    for reserva in reservas_con_alquiler:
        empleado = random.choice(empleados_list)
        
        # Fecha de inicio del alquiler (basada en la fecha_inicio de la reserva)
        fecha_inicio_base = datetime.combine(
            reserva.fecha_inicio,
            datetime.min.time()
        )
        hora_inicio = random.randint(8, 18)
        minuto_inicio = random.randint(0, 59)
        
        # Crear datetime string para SQLite
        fecha_inicio = fecha_inicio_base.replace(
            hour=hora_inicio, minute=minuto_inicio
        ).strftime('%Y-%m-%d %H:%M:%S')
        
        # Duración del alquiler (3-10 días)
        duracion_dias = random.randint(3, 10)
        fecha_fin_dt = fecha_inicio_base.replace(
            hour=hora_inicio, minute=minuto_inicio
        ) + timedelta(
            days=duracion_dias,
            hours=random.randint(-2, 4),
            minutes=random.randint(0, 59)
        )
        fecha_fin = fecha_fin_dt.strftime('%Y-%m-%d %H:%M:%S')
        
        # Calcular total_pago
        fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d %H:%M:%S')
        dias_efectivos = max(1, (fecha_fin_dt - fecha_inicio_dt).days)
        if (fecha_fin_dt - fecha_inicio_dt).seconds > 0 and dias_efectivos > 0:
            dias_efectivos += 1
        
        total_pago = float(Decimal(str(dias_efectivos)) * reserva.vehiculo.precio_por_dia)
        
        alquileres_data.append((
            next_alquiler_id,
            reserva.cliente.dni,
            reserva.vehiculo.patente,
            empleado.dni,
            reserva.id,
            fecha_inicio,
            fecha_fin,
            total_pago
        ))
        next_alquiler_id += 1
    
    # Insertar con SQL directo para evitar auto_now_add
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.executemany(
        """INSERT INTO ALQUILERES (id, cliente_dni, vehiculo_patente, empleado_dni, reserva_id, fecha_inicio, fecha_fin, total_pago)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        alquileres_data
    )
    conn.commit()
    conn.close()
    
    print(f"   ✓ {len(alquileres_data)} alquileres creados (todos finalizados)")
    
    print("\n✓ Reservas y alquileres poblados correctamente\n")
    
    return reservas_data, alquileres_data


# ============================================================================
# FUNCIÓN PARA POBLAR MANTENIMIENTOS, MULTAS Y DAÑOS
# ============================================================================

def poblar_mantenimientos_multas_danios(vehiculos_list, empleados_list):
    """Crea mantenimientos, multas y daños"""
    print("="*70)
    print("POBLANDO MANTENIMIENTOS, MULTAS Y DAÑOS")
    print("="*70)
    
    # ========== MANTENIMIENTOS ==========
    print("\n🔧 Creando mantenimientos...")
    mantenimientos = []
    
    # Meses para mantenimientos: julio a octubre
    meses_mantenimiento = [7, 8, 9, 10]
    
    for _ in range(12):
        vehiculo = random.choice(vehiculos_list)
        empleado = random.choice(empleados_list)
        
        mes = random.choice(meses_mantenimiento)
        dia_inicio = random.randint(1, 25)
        fecha_inicio = date(2025, mes, dia_inicio)
        
        # Duración del mantenimiento: 2-7 días
        duracion = random.randint(2, 7)
        fecha_fin = fecha_inicio + timedelta(days=duracion)
        
        mantenimiento = Mantenimiento(
            empleado=empleado,
            vehiculo=vehiculo,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )
        mantenimientos.append(mantenimiento)
    
    Mantenimiento.objects.bulk_create(mantenimientos)
    print(f"   ✓ {len(mantenimientos)} mantenimientos creados (todos finalizados)")
    
    # ========== MULTAS ==========
    print("\n💰 Creando multas...")
    
    # Obtener alquileres existentes
    alquileres_existentes = list(Alquiler.objects.all())
    
    if len(alquileres_existentes) == 0:
        print("   ⚠ No hay alquileres para asociar multas")
        multas = []
    else:
        multas = []
        num_multas = min(18, len(alquileres_existentes))
        alquileres_con_multa = random.sample(alquileres_existentes, num_multas)
        
        for alquiler in alquileres_con_multa:
            motivo = random.choice(MOTIVOS_MULTAS)
            monto = Decimal(str(random.randint(2500, 8000)))
            
            multa = Multa(
                alquiler=alquiler,
                motivo=motivo,
                monto=monto
            )
            multas.append(multa)
        
        Multa.objects.bulk_create(multas)
        print(f"   ✓ {len(multas)} multas creadas")
    
    # ========== DAÑOS ==========
    print("\n⚠️  Creando daños...")
    
    if len(alquileres_existentes) == 0:
        print("   ⚠ No hay alquileres para asociar daños")
        danios = []
    else:
        danios = []
        num_danios = min(14, len(alquileres_existentes))
        
        # Evitar repetir alquileres que ya tienen multa para mayor variedad
        alquileres_disponibles = [a for a in alquileres_existentes]
        alquileres_con_danio = random.sample(alquileres_disponibles, num_danios)
        
        for alquiler in alquileres_con_danio:
            descripcion = random.choice(DESCRIPCIONES_DANIOS)
            monto = Decimal(str(random.randint(5000, 55000)))
            
            danio = Danio(
                alquiler=alquiler,
                descripcion=descripcion,
                monto=monto
            )
            danios.append(danio)
        
        Danio.objects.bulk_create(danios)
        print(f"   ✓ {len(danios)} daños creados")
    
    print("\n✓ Mantenimientos, multas y daños poblados correctamente\n")
    
    return mantenimientos, multas, danios


# ============================================================================
# FUNCIÓN PARA FINALIZAR
# ============================================================================

def finalizar_poblacion():
    """Asegura que todos los vehículos estén disponibles"""
    print("="*70)
    print("FINALIZANDO")
    print("="*70)
    
    print("\n🚗 Marcando todos los vehículos como disponibles...")
    count = Vehiculo.objects.update(estado='disponible')
    print(f"   ✓ {count} vehículos actualizados a estado 'disponible'")
    
    print("\n✓ Población completada correctamente\n")


# ============================================================================
# FUNCIÓN PARA MOSTRAR RESUMEN
# ============================================================================

def mostrar_resumen():
    """Muestra un resumen de los datos creados"""
    print("="*70)
    print("RESUMEN DE DATOS POBLADOS")
    print("="*70)
    
    print(f"\n📊 Datos Maestros:")
    print(f"   • Vehículos:      {Vehiculo.objects.count()}")
    print(f"   • Empleados:      {Empleado.objects.count()}")
    print(f"   • Clientes:       {Cliente.objects.count()}")
    
    print(f"\n📅 Operaciones:")
    print(f"   • Reservas:       {Reserva.objects.count()}")
    reservas_por_estado = {}
    for estado, _ in Reserva.ESTADOS:
        count = Reserva.objects.filter(estado=estado).count()
        if count > 0:
            reservas_por_estado[estado] = count
    for estado, count in reservas_por_estado.items():
        print(f"     - {estado.capitalize()}: {count}")
    
    print(f"\n🚗 Alquileres:")
    print(f"   • Total:          {Alquiler.objects.count()}")
    print(f"   • Activos:        {Alquiler.objects.filter(fecha_fin__isnull=True).count()}")
    print(f"   • Finalizados:    {Alquiler.objects.filter(fecha_fin__isnull=False).count()}")
    
    print(f"\n🔧 Otros:")
    print(f"   • Mantenimientos: {Mantenimiento.objects.count()}")
    print(f"   • Multas:         {Multa.objects.count()}")
    print(f"   • Daños:          {Danio.objects.count()}")
    
    print(f"\n💰 Estadísticas Financieras:")
    total_ingresos = sum([a.total_pago for a in Alquiler.objects.filter(total_pago__isnull=False)])
    total_multas = sum([m.monto for m in Multa.objects.all()])
    total_danios = sum([d.monto for d in Danio.objects.all()])
    
    print(f"   • Ingresos por alquileres: ${total_ingresos:,.2f}")
    print(f"   • Total en multas:         ${total_multas:,.2f}")
    print(f"   • Total en daños:          ${total_danios:,.2f}")
    print(f"   • TOTAL:                   ${total_ingresos + total_multas + total_danios:,.2f}")
    
    print("\n" + "="*70)
    print("✅ BASE DE DATOS POBLADA EXITOSAMENTE")
    print("="*70 + "\n")


# ============================================================================
# FUNCIÓN PRINCIPAL
# ============================================================================

def main():
    """Función principal del script"""
    print("\n" + "="*70)
    print("SCRIPT DE POBLACIÓN DE BASE DE DATOS")
    print("Sistema de Alquiler de Vehículos")
    print("Período: Julio - Noviembre 2025")
    print("="*70)
    
    try:
        # Paso 1: Limpiar base de datos
        limpiar_base_datos()
        
        # Paso 2: Poblar datos maestros
        vehiculos, empleados, clientes = poblar_datos_maestros()
        
        # Paso 3: Poblar reservas y alquileres
        reservas, alquileres = poblar_reservas_y_alquileres(vehiculos, empleados, clientes)
        
        # Paso 4: Poblar mantenimientos, multas y daños
        mantenimientos, multas, danios = poblar_mantenimientos_multas_danios(vehiculos, empleados)
        
        # Paso 5: Finalizar (marcar vehículos como disponibles)
        finalizar_poblacion()
        
        # Paso 6: Mostrar resumen
        mostrar_resumen()
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
