import os
import django
import pandas as pd
from django.db import connection
import pytz
from django.utils.timezone import make_aware
from datetime import datetime

# Configurar o ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_city.settings')
django.setup()

from app.models import Sensores

# Definir o timezone correto
tz = pytz.timezone('America/Sao_Paulo')

def listar_sensores():
    """
    Lista todos os sensores no banco de dados e verifica inconsistências.
    """
    sensores = Sensores.objects.all()
    print(f"Total de sensores retornados: {sensores.count()}")

    for sensor in sensores:
        print(f"Sensor: {sensor}")

    # Consulta direta ao banco para verificar total de registros
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM app_sensores")
        total = cursor.fetchone()[0]
        print(f"Total de sensores no banco de dados: {total}")

    if sensores.count() < total:
        print("Alguns sensores podem não estar sendo exibidos corretamente!")

if __name__ == "__main__":
    listar_sensores()