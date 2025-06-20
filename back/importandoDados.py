# Utilizado apenas para fazer o crud antes de fazer o importar e exportar os arquivos

import os
import django
import pandas as pd
from django.utils.timezone import make_aware, is_naive
import pytz
from datetime import datetime

#configurar o ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_city.settings')
django.setup()

from app.models import Ambientes, Sensores, Historico

#definindo o timezone correto
tz = pytz.timezone('America/Sao_Paulo')

def importar_ambientes():
    caminho = os.path.join(os.path.dirname(__file__), 'data', 'ambientes.xlsx')
    df = pd.read_excel(caminho, engine='openpyxl')

    for _, row in df.iterrows():
        ambiente = Ambientes.objects.create(
            sig=row['sig'],
            descricao=row['descricao'],
            ni=row['ni'],
            responsavel=row['responsavel'],
        )
        print(f"Criado: {ambiente}")

def str_to_bool(s):
    if isinstance(s, bool):
        return s
    return str(s).strip().lower() == 'true'

def importar_sensores():
    caminho = os.path.join(os.path.dirname(__file__), 'data', 'sensores.xlsx')
    df = pd.read_excel(caminho, engine='openpyxl')

    for _, row in df.iterrows():
        sensor = Sensores.objects.create(
            sensor=row['sensor'],
            mac_address=row['mac_address'],
            unidade_medida=row['unidade_medida'],
            latitude=row['latitude'],
            longitude=row['longitude'],
            status=str_to_bool(row['status']),
        )
        print(f"Criado: {sensor}")


def tratar_timestamp(raw_timestamp, linha_idx):
    try:
        if pd.isna(raw_timestamp) or str(raw_timestamp).strip() == '':
            dt = datetime.now(tz)
            unix_timestamp = int(dt.timestamp())
            print(f"Linha {linha_idx}: timestamp vazio, usando data atual {dt}")
            return unix_timestamp

        if isinstance(raw_timestamp, (int, float)):
            unix_timestamp = int(raw_timestamp)
            print(f"Linha {linha_idx}: timestamp numérico {unix_timestamp}")
            return unix_timestamp

        #se for string tipo 24/07/2025 23:13:00
        dt = pd.to_datetime(raw_timestamp, dayfirst=True, errors='coerce')
        if pd.isna(dt):
            raise ValueError("Timestamp inválido")

        if isinstance(dt, pd.Timestamp):
            dt = dt.to_pydatetime()
        if is_naive(dt):
            dt = make_aware(dt, timezone=tz)

        unix_timestamp = int(dt.timestamp())
        print(f"Linha {linha_idx}: timestamp convertido {unix_timestamp}")
        return unix_timestamp

    except Exception as e:
        print(f"Linha {linha_idx}: Erro ao tratar timestamp '{raw_timestamp}' → {e}")
        dt = datetime.now(tz)
        return int(dt.timestamp())

def importar_historicos():
    caminho = os.path.join(os.path.dirname(__file__), 'data', 'historico.xlsx')
    df = pd.read_excel(caminho, engine='openpyxl')

    for idx, row in df.iterrows():
        try:
            raw_timestamp = row['timestamp']
            unix_timestamp = tratar_timestamp(raw_timestamp, idx)

            sensor = Sensores.objects.get(id=row['sensor'])
            ambiente = Ambientes.objects.get(id=row['ambiente'])

            Historico.objects.create(
                sensor=sensor,
                ambiente=ambiente,
                valor=row['valor'],
                timestamp=unix_timestamp,
            )
            print(f"Linha {idx}: criado com timestamp {unix_timestamp}")

        except Sensores.DoesNotExist:
            print(f"Sensor ID {row['sensor']} não encontrado na linha {idx}.")
        except Ambientes.DoesNotExist:
            print(f"Ambiente ID {row['ambiente']} não encontrado na linha {idx}.")
        except Exception as e:
            print(f"Erro na linha {idx}: {e}")


if __name__ == '__main__':
    importar_ambientes()
    importar_sensores()
    importar_historicos()
