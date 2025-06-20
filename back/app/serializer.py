from rest_framework import serializers
from .models import Sensores, Ambientes, Historico
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime
from django.utils.timezone import localtime
import re


class LoginSerializer(TokenObtainPairSerializer):
    # Extende o serializer do Simple JWT para incluir dados adicionais no retorno do token
    def validate(self, attrs):
        data = super().validate(attrs)
        # Adiciona o ID do usuário no retorno
        data['user_id'] = self.user.id
        # Adiciona o nome de usuário no retorno
        data['username'] = self.user.username
        return data
    

class SensoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensores
        fields = '__all__'  # Serializa todos os campos do modelo Sensores

    def validate(self, data):
        sensor = data.get('sensor')
        unidade = data.get('unidade_medida')

        # Define as unidades válidas para cada tipo de sensor
        unidades_validas = {
            'contador': ['uni'],
            'luminosidade': ['lux'],
            'temperatura': ['°C'],
            'umidade': ['%'],
        }

        # Valida se a unidade fornecida é válida para o tipo de sensor selecionado
        if sensor and unidade:
            unidades_permitidas = unidades_validas.get(sensor, [])
            if unidade not in unidades_permitidas:
                raise serializers.ValidationError(
                    {
                        'unidade_medida': f"A unidade '{unidade}' não é válida para o sensor '{sensor}'. "
                                         f"Unidades válidas: {', '.join(unidades_permitidas)}"
                    }
                )
        return data

    def validate_mac_address(self, value):
        # Valida o formato do MAC Address usando regex
        mac_pattern = re.compile(r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
        if not mac_pattern.match(value):
            raise serializers.ValidationError("MAC Address inválido. Formato esperado: 00:1B:44:11:3A:B9")
        return value


class AmbientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambientes
        fields = '__all__'  # Serializa todos os campos do modelo Ambientes


class HistoricoSerializer(serializers.ModelSerializer):
    # Campo adicional que retorna a data formatada do timestamp
    timestamp_formatado = serializers.SerializerMethodField()

    class Meta:
        model = Historico
        # Campos que serão serializados
        fields = ['id', 'sensor', 'ambiente', 'valor', 'timestamp', 'timestamp_formatado']

    def get_timestamp_formatado(self, obj):
        # Formata o timestamp
        if isinstance(obj.timestamp, datetime):
            local_dt = localtime(obj.timestamp)  # Converte para timezone local
            return local_dt.strftime('%d/%m/%Y %H:%M:%S')
        return str(obj.timestamp)
