from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Post, Comment

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('age', 'role', 'bio')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('age', 'role', 'bio')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Post)
admin.site.register(Comment)
