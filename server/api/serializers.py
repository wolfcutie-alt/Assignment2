from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    image = serializers.ImageField(required=False, source='profile_image')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'age', 'role', 'bio', 'profile_image', 'image', 'date_joined')
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        # Remove image from validated_data if it exists
        image = validated_data.pop('image', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Set profile image if provided
        if image:
            user.profile_image = image
            user.save()
            
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

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