from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is an admin
        return request.user and hasattr(request.user, 'admin_id')

class IsAuthor(permissions.BasePermission):
    """
    Custom permission to only allow authors to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is an author
        return request.user and hasattr(request.user, 'author_id')

class IsModerator(permissions.BasePermission):
    """
    Custom permission to only allow moderators to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a moderator
        return request.user and hasattr(request.user, 'moderator_id')

class IsAuthorOrAdminOrModerator(permissions.BasePermission):
    """
    Custom permission to allow authors, admins, and moderators to access the view.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and is an author, admin, or moderator
        return request.user and (
            hasattr(request.user, 'author_id') or 
            hasattr(request.user, 'admin_id') or 
            hasattr(request.user, 'moderator_id')
        )

class IsPostAuthorOrAdminOrModerator(permissions.BasePermission):
    """
    Custom permission to only allow the author of a post, admins, or moderators to modify it.
    """
    def has_object_permission(self, request, view, obj):
        # Admins and moderators can do anything
        if hasattr(request.user, 'admin_id') or hasattr(request.user, 'moderator_id'):
            return True
        
        # Authors can only modify their own posts
        if hasattr(request.user, 'author_id'):
            return obj.author == request.user
        
        return False

class IsAuthorOrAdminOrModeratorForAuthor(permissions.BasePermission):
    """
    Custom permission to only allow the author to modify their own information,
    or admins and moderators to modify any author's information.
    """
    def has_object_permission(self, request, view, obj):
        # Admins and moderators can modify any author
        if hasattr(request.user, 'admin_id') or hasattr(request.user, 'moderator_id'):
            return True
        
        # Authors can only modify their own information
        if hasattr(request.user, 'author_id'):
            return obj.author_id == request.user.author_id
        
        return False 