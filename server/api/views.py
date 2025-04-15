from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Post, Comment
from .serializers import UserSerializer, PostSerializer, CommentSerializer
from .permissions import IsAuthorOrReadOnly, IsModeratorOrReadOnly, IsAdminOrReadOnly

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'list']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
        return Post.objects.filter(author=user)

    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        post = self.get_object()
        if not request.user.groups.filter(name='Moderators').exists():
            return Response(
                {'error': 'Only moderators can moderate posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        post.moderated = True
        post.moderator = request.user
        post.save()
        return Response({'status': 'post moderated'})
        
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        action = request.data.get('action', 'like')
        
        if action == 'like':
            post.like_count += 1
        elif action == 'dislike' and post.like_count > 0:
            post.like_count -= 1
            
        post.save()
        return Response({
            'status': f'post {action}d', 
            'like_count': post.like_count,
            'is_liked': action == 'like'
        })

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
