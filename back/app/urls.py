from django.urls import path
from .views import *

urlpatterns = [
    # Autenticação
    path('login/', LoginView.as_view(), name='login'),

    # Ambientes
    path('ambientes/', AmbienteListCreateAPIView.as_view(), name='ambiente-list'),
    path('ambientes/<int:pk>/', AmbienteRetrieveUpdateDestroyAPIView.as_view(), name='ambiente-detail'),
    path('ambientes/import/', AmbienteImportExportAPIView.as_view(), name='ambiente-import'),
    path('ambientes/export/', AmbienteImportExportAPIView.as_view(), name='ambiente-export'),

    # Sensores
    path('sensores/', SensoresListCreateAPIView.as_view(), name='sensor-list'),
    path('sensores/<int:pk>/', SensoresRetrieveUpdateDestroyAPIView.as_view(), name='sensor-detail'),
    path('sensores/import/', SensoresImportExportAPIView.as_view(), name='sensor-import'),
    path('sensores/export/', SensoresImportExportAPIView.as_view(), name='sensor-export'),
    path('sensores/status-resumo/', SensorStatusResumoAPIView.as_view(), name='sensor-status-resumo'),


    # Históricos
    path('historicos/', HistoricoListCreateAPIView.as_view(), name='historico-list'),
    path('historicos/<int:pk>/', HistoricoRetrieveUpdateDestroyAPIView.as_view(), name='historico-detail'),
    path('historicos/import/', HistoricoImportExportAPIView.as_view(), name='historico-import'),
    path('historicos/export/', HistoricoImportExportAPIView.as_view(), name='historico-export'),
]
