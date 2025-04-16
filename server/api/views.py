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
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='me/update')
    def update_me(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        # Check if this is a moderation-specific request
        is_moderation_request = self.request.path.endswith('/moderate/') or self.request.path.endswith('/unmoderated/')
        
        # For moderation endpoints, show all posts to staff/moderators
        if is_moderation_request and (self.request.user.is_staff or self.request.user.role == 'moderator'):
            return Post.objects.all()
            
        # For regular views (like home screen), only show moderated posts for everyone
        return Post.objects.filter(moderated=True)

    @action(detail=False, methods=['get'])
    def unmoderated(self, request):
        if request.user.role != 'moderator' and request.user.role != 'admin':
            return Response(
                {'error': 'Only moderators can view unmoderated posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        unmoderated_posts = Post.objects.filter(moderated=False)
        serializer = self.get_serializer(unmoderated_posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        post = self.get_object()
        if request.user.role != 'moderator' and request.user.role != 'admin':
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
