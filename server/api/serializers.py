from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'age', 'role', 'bio')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author', 'post', 'content', 'create_date')
        read_only_fields = ('author', 'create_date')

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    moderator = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'title', 'author', 'content', 'moderated', 'create_date', 
                 'moderator', 'like_count', 'comments')
        read_only_fields = ('author', 'moderator', 'create_date', 'like_count') 