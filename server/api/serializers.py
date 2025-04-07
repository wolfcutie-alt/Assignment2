from rest_framework import serializers
from .models import Category, Post, Author, Admin, Comments, Moderator

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Author
        fields = ['author_name', 'email', 'password', 'confirm_password']
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if email is already in use
        if Author.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email is already in use")
        
        return data

class AuthorSerializer(serializers.ModelSerializer):
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Author
        fields = ['author_id', 'author_name', 'email', 'posts']  # Excluding password for security

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['admin_id', 'name', 'username']  # Excluding password for security

class ModeratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moderator
        fields = ['moderator_id', 'name', 'username', 'email', 'is_active']  # Excluding password for security

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'
