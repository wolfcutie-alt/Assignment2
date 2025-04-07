from django.db import models

# Create your models here.
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.title or ''

class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    date_published = models.DateField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)
    moderated = models.BooleanField(default=False)
    moderator = models.ForeignKey('Moderator', on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey('Author', on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return self.title

class Author(models.Model):
    author_id = models.AutoField(primary_key=True)
    author_name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=128)  # Using a longer field for hashed password

    def __str__(self):
        return self.author_name

class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)  # Using a longer field for hashed password

    def __str__(self):
        return self.username

class Moderator(models.Model):
    moderator_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)  # Using a longer field for hashed password
    email = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username

class Comments(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    authors = models.ForeignKey(Admin, on_delete=models.CASCADE)
    content = models.CharField(max_length=50)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.post.title} by {self.authors.username}"

