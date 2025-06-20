from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):
    """
    Permissão personalizada que permite o acesso apenas a superusuários autenticados.
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado e é superusuário
        if request.user.is_authenticated and request.user.is_superuser:
            return True
        return False
