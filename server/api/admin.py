from django.contrib import admin
from .models import Category, Post, Author, Admin, Comments, Moderator

admin.site.register(Category)
admin.site.register(Post)
admin.site.register(Author)
admin.site.register(Admin)
admin.site.register(Moderator)
admin.site.register(Comments)
