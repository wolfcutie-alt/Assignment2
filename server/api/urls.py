from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, PostViewSet, AuthorViewSet,
    AdminViewSet, CommentsViewSet, ModeratorViewSet,
    admin_login, author_login, moderator_login, signup
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'posts', PostViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'admins', AdminViewSet)
router.register(r'moderators', ModeratorViewSet)
router.register(r'comments', CommentsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    path('login/admin/', admin_login, name='admin-login'),
    path('login/author/', author_login, name='author-login'),
    path('login/moderator/', moderator_login, name='moderator-login'),
]
