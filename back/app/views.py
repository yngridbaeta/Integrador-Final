from .permissions import IsSuperUser
from .serializer import LoginSerializer, AmbientesSerializer, SensoresSerializer, HistoricoSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ambientes, Historico, Sensores
import pandas as pd
from django.utils.timezone import localtime
from datetime import datetime


# VIEW DE LOGIN COM JWT
class LoginView(TokenObtainPairView):
    # Utiliza o serializer customizado que retorna dados extras no token
    serializer_class = LoginSerializer


# Define um filtro para buscar ambientes pelo campo 'sig' com busca case insensitive
class AmbienteFilter(filters.FilterSet):
    sig = filters.CharFilter(field_name='sig', lookup_expr='icontains')

    class Meta:
        model = Ambientes
        fields = ['sig']


# VIEW PARA LISTAR E CRIAR AMBIENTES
class AmbienteListCreateAPIView(ListCreateAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = AmbientesSerializer
    permission_classes = [IsSuperUser]  # Permite acesso apenas para superusuários
    filter_backends = [DjangoFilterBackend]  # Ativa filtros para esta view
    filterset_class = AmbienteFilter  # Usa o filtro customizado definido acima


# VIEW PARA RECUPERAR, ATUALIZAR OU DELETAR UM AMBIENTE ESPECÍFICO
class AmbienteRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = AmbientesSerializer
    permission_classes = [IsSuperUser]


# VIEW PARA LISTAR E CRIAR HISTÓRICOS
class HistoricoListCreateAPIView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsSuperUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'id': ['exact'],
        'sensor__id': ['exact'],
        'sensor__sensor': ['icontains'],
        'timestamp': ['exact', 'gte', 'lte', 'icontains'],  # Permite filtro por data
        'ambiente__sig': ['exact'],
    }


# VIEW PARA RECUPERAR, ATUALIZAR OU DELETAR UM REGISTRO DE HISTÓRICO
class HistoricoRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsSuperUser]


# VIEW PARA LISTAR E CRIAR SENSORES
class SensoresListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsSuperUser]
    queryset = Sensores.objects.all()
    serializer_class = SensoresSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'id': ['exact'],
        'sensor': ['exact', 'icontains'],
        'mac_address': ['exact', 'icontains'],
        'unidade_medida': ['exact', 'icontains'],
    }


# VIEW PARA RECUPERAR, ATUALIZAR OU DELETAR UM SENSOR ESPECiFICO
class SensoresRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Sensores.objects.all()
    serializer_class = SensoresSerializer
    permission_classes = [IsSuperUser]


# VIEW PARA IMPORTAÇÃO E EXPORTAÇÃO DE AMBIENTES EM EXCEL
class AmbienteImportExportAPIView(APIView):
    permission_classes = [IsSuperUser]

    def post(self, request):
        """Importa registros de ambientes a partir de um arquivo Excel enviado na requisição"""
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Nenhum arquivo enviado'}, status=400)

        df = pd.read_excel(file, engine='openpyxl')
        for _, row in df.iterrows():
            # Cria ou obtém ambiente existente com o campo 'sig'
            Ambientes.objects.get_or_create(
                sig=row['sig'],
                defaults={
                    'descricao': row['descricao'],
                    'ni': row['ni'],
                    'responsavel': row['responsavel'],
                }
            )

        return Response({'message': 'Importação concluída!'})

    def get(self, request):
        """Exporta todos os ambientes para um arquivo Excel para download"""
        queryset = Ambientes.objects.all()
        data = [
            {
                'ID': ambiente.id,
                'sig': ambiente.sig,
                'descricao': ambiente.descricao,
                'ni': ambiente.ni,
                'responsavel': ambiente.responsavel,
            } for ambiente in queryset
        ]
        df = pd.DataFrame(data)

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=ambientes.xlsx'

        # Salva o DataFrame no response em formato Excel
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        return response


# VIEW PARA IMPORTAÇÃO E EXPORTAÇÃO DE SENSORES EM EXCEL
class SensoresImportExportAPIView(APIView):
    permission_classes = [IsSuperUser]

    def post(self, request):
        """Importa sensores a partir de um arquivo Excel enviado"""
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Nenhum arquivo enviado'}, status=400)

        df = pd.read_excel(file, engine='openpyxl')
        for _, row in df.iterrows():
            Sensores.objects.create(
                mac_address=row['mac_address'],
                sensor=row['sensor'],
                unidade_medida=row['unidade_medida'],
                latitude=row['latitude'],
                longitude=row['longitude'],
                status=str(row['status']).strip().lower() == 'true',  # Converte string para booleano
            )

        return Response({'message': 'Importação concluída!'})

    def get(self, request):
        """Exporta sensores para arquivo Excel para download"""
        queryset = Sensores.objects.all()
        data = [{'ID': s.id, 'Sensor': s.sensor, 'MAC': s.mac_address, 'Unidade': s.unidade_medida, 'Lat': s.latitude, 'Lon': s.longitude, 'Status': s.status} for s in queryset]
        df = pd.DataFrame(data)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=sensores.xlsx'
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        return response


# VIEW PARA IMPORTAÇÃO E EXPORTAÇÃO DE HISTÓRICO EM excel
class HistoricoImportExportAPIView(APIView):
    permission_classes = [IsSuperUser]

    def post(self, request):
        """Importa registros históricos a partir de arquivo Excel enviado"""
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Nenhum arquivo enviado'}, status=400)

        df = pd.read_excel(file, engine='openpyxl')

        for _, row in df.iterrows():
            try:
                sensor = Sensores.objects.get(id=row['sensor'])
                ambiente = Ambientes.objects.get(id=row['ambiente'])

                # Tenta converter o timestamp para datetime, se falhar pula o registro
                try:
                    timestamp = pd.to_datetime(row['timestamp'])
                except Exception as e:
                    print(f"Erro ao converter timestamp: {row['timestamp']}, erro: {e}")
                    continue  # Ignora registro inválido

                Historico.objects.create(
                    sensor=sensor,
                    ambiente=ambiente,
                    valor=row['valor'],
                    timestamp=timestamp,
                )
            except Sensores.DoesNotExist:
                print(f"Sensor ID {row['sensor']} não encontrado!")
            except Ambientes.DoesNotExist:
                print(f"Ambiente ID {row['ambiente']} não encontrado!")

        return Response({'message': 'Importação concluída!'})

    def get(self, request):
        """Exporta todos os registros históricos para arquivo Excel para download"""
        queryset = Historico.objects.all()
        data = [
            {
                'ID': h.id,
                'Sensor': h.sensor.sensor,
                'Ambiente': h.ambiente.sig,
                'Valor': h.valor,
                'Timestamp': localtime(h.timestamp).strftime('%d/%m/%Y %H:%M:%S')
            }
            for h in queryset
        ]
        df = pd.DataFrame(data)

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=historico.xlsx'

        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        return response


# VIEW PARA RETORNAR UM RESUMO DO STATUS DOS SENSORES (ativos e inativos)
class SensorStatusResumoAPIView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        ativos = Sensores.objects.filter(status=True).count()  # Conta sensores ativos
        inativos = Sensores.objects.filter(status=False).count()  # Conta sensores inativos
        return Response({
            'ativos': ativos,
            'inativos': inativos
        })
