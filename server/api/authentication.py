from rest_framework import authentication
from rest_framework import exceptions
from .models import Admin, Author, Moderator

class AdminAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.META.get('HTTP_X_ADMIN_USERNAME')
        password = request.META.get('HTTP_X_ADMIN_PASSWORD')
        
        if not username or not password:
            return None
        
        try:
            admin = Admin.objects.get(username=username, password=password)
            return (admin, None)
        except Admin.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid admin credentials')

class AuthorAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        email = request.META.get('HTTP_X_AUTHOR_EMAIL')
        password = request.META.get('HTTP_X_AUTHOR_PASSWORD')
        
        if not email or not password:
            return None
        
        try:
            author = Author.objects.get(email=email, password=password)
            return (author, None)
        except Author.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid author credentials')

class ModeratorAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.META.get('HTTP_X_MODERATOR_USERNAME')
        password = request.META.get('HTTP_X_MODERATOR_PASSWORD')
        
        if not username or not password:
            return None
        
        try:
            moderator = Moderator.objects.get(username=username, password=password, is_active=True)
            return (moderator, None)
        except Moderator.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid moderator credentials')

class CombinedAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Try admin authentication
        admin_auth = AdminAuthentication()
        admin_result = admin_auth.authenticate(request)
        if admin_result:
            return admin_result
        
        # Try author authentication
        author_auth = AuthorAuthentication()
        author_result = author_auth.authenticate(request)
        if author_result:
            return author_result
        
        # Try moderator authentication
        moderator_auth = ModeratorAuthentication()
        moderator_result = moderator_auth.authenticate(request)
        if moderator_result:
            return moderator_result
        
        return None 