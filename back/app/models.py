from django.db import models
from django.core.exceptions import ValidationError
import re

class Sensores(models.Model):
    #tipos de sensores disponíveis para seleção
    SENSOR_TYPES = [
        ('contador', 'Contador'),
        ('luminosidade', 'Luminosidade'),
        ('temperatura', 'Temperatura'),
        ('umidade', 'Umidade'),
    ]

    #unidades de medida válidas para os sensores
    UNIDADE_MEDIDA_CHOICES = [
        ('uni', 'uni'),
        ('lux', 'lux'),
        ('°C', '°C'),
        ('%', '%'),
    ]

    mac_address = models.CharField(max_length=100)
    sensor = models.CharField(max_length=100, choices=SENSOR_TYPES)
    unidade_medida = models.CharField(max_length=20, choices=UNIDADE_MEDIDA_CHOICES)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.BooleanField()

    def clean(self):
        """
        Validação personalizada para garantir que o MAC Address
        esteja no formato correto
        """
        mac_pattern = re.compile(r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
        if not mac_pattern.match(self.mac_address):
            raise ValidationError("MAC Address inválido. Formato esperado: 00:1B:44:11:3A:B9")
        
    def __str__(self):
        return f"{self.sensor} ({self.mac_address})"

    
class Ambientes(models.Model):
    # Identificador do ambiente
    sig = models.IntegerField()
    descricao = models.CharField(max_length=100)
    ni = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)

    def __str__(self):
        # Representa o ambiente pelo sig
        return str(self.sig)
    

class Historico(models.Model):
    # Relaciona o histórico a um sensor e a um ambiente específicos
    sensor = models.ForeignKey(Sensores, on_delete=models.CASCADE)
    ambiente = models.ForeignKey(Ambientes, on_delete=models.CASCADE)
    valor = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        # Representa o histórico pelo valor registrado
        return str(self.valor)
