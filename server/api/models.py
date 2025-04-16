from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone

# Create your models here.

class User(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Administrator'),
        ('moderator', 'Moderator'),
        ('author', 'Author')
    ], default='author')
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # Only on creation
            super().save(*args, **kwargs)
            author_group, _ = Group.objects.get_or_create(name='Authors')
            self.groups.add(author_group)
        else:
            super().save(*args, **kwargs)

class Post(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    moderated = models.BooleanField(default=False)
    create_date = models.DateTimeField(default=timezone.now)
    moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_posts')
    like_count = models.IntegerField(default=0)
    post_image = models.ImageField(upload_to='post_images/', null=True, blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    create_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'
