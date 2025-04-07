from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password, check_password
from .models import Category, Post, Author, Admin, Comments, Moderator
from .serializers import (
    CategorySerializer, PostSerializer, AuthorSerializer,
    AdminSerializer, CommentsSerializer, ModeratorSerializer,
    SignupSerializer
)
from .permissions import (
    IsAdmin, IsAuthor, IsModerator, IsAuthorOrAdminOrModerator,
    IsPostAuthorOrAdminOrModerator, IsAuthorOrAdminOrModeratorForAuthor
)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Sign up view that allows users to register as authors.
    """
    serializer = SignupSerializer(data=request.data)
    
    if serializer.is_valid():
        # Create new author with hashed password
        author = Author.objects.create(
            author_name=serializer.validated_data['author_name'],
            email=serializer.validated_data['email'],
            password=make_password(serializer.validated_data['password'])
        )
        
        return Response({
            'author_id': author.author_id,
            'author_name': author.author_name,
            'email': author.email,
            'message': 'Author registered successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        admin = Admin.objects.get(username=username)
        if check_password(password, admin.password):
            return Response({
                'admin_id': admin.admin_id,
                'name': admin.name,
                'username': admin.username,
                'message': 'Login successful'
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def author_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        author = Author.objects.get(email=email)
        if check_password(password, author.password):
            return Response({
                'author_id': author.author_id,
                'author_name': author.author_name,
                'email': author.email,
                'message': 'Login successful'
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Author.DoesNotExist:
        return Response({'error': 'Author not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def moderator_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        moderator = Moderator.objects.get(username=username, is_active=True)
        if check_password(password, moderator.password):
            return Response({
                'moderator_id': moderator.moderator_id,
                'name': moderator.name,
                'username': moderator.username,
                'email': moderator.email,
                'message': 'Login successful'
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Moderator.DoesNotExist:
        return Response({'error': 'Moderator not found'}, status=status.HTTP_404_NOT_FOUND)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthorOrAdminOrModerator]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrAdminOrModerator, IsPostAuthorOrAdminOrModerator]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes_count += 1
        post.save()
        return Response({'status': 'post liked'})
    
    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        post = self.get_object()
        moderator_id = request.data.get('moderator_id')
        
        try:
            moderator = Moderator.objects.get(moderator_id=moderator_id)
            post.moderated = True
            post.moderator = moderator
            post.save()
            return Response({'status': 'post moderated'})
        except Moderator.DoesNotExist:
            return Response(
                {'error': 'Moderator not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def get_queryset(self):
        queryset = Post.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset
    
    def perform_create(self, serializer):
        # Set the author to the current user if it's an author
        if hasattr(self.request.user, 'author_id'):
            serializer.save(author=self.request.user)
        else:
            serializer.save()

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthorOrAdminOrModerator, IsAuthorOrAdminOrModeratorForAuthor]

    def create(self, request, *args, **kwargs):
        request.data['password'] = make_password(request.data['password'])
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'password' in request.data:
            request.data['password'] = make_password(request.data['password'])
        return super().update(request, *args, **kwargs)

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        request.data['password'] = make_password(request.data['password'])
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'password' in request.data:
            request.data['password'] = make_password(request.data['password'])
        return super().update(request, *args, **kwargs)

class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = Moderator.objects.all()
    serializer_class = ModeratorSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        request.data['password'] = make_password(request.data['password'])
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'password' in request.data:
            request.data['password'] = make_password(request.data['password'])
        return super().update(request, *args, **kwargs)

class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [IsAuthorOrAdminOrModerator]

    def get_queryset(self):
        queryset = Comments.objects.all()
        post_id = self.request.query_params.get('post', None)
        if post_id is not None:
            queryset = queryset.filter(post=post_id)
        return queryset
