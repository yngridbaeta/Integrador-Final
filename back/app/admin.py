from django.contrib import admin
from .models import Ambientes, Sensores, Historico

#registra os modelos no painel administrativo do Django
admin.site.register(Ambientes)
admin.site.register(Sensores)
admin.site.register(Historico)
