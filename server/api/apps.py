from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from django.contrib.auth.models import Group
        from django.db.models.signals import post_migrate

        def create_groups(sender, **kwargs):
            Group.objects.get_or_create(name='Administrators')
            Group.objects.get_or_create(name='Moderators')
            Group.objects.get_or_create(name='Authors')

        post_migrate.connect(create_groups, sender=self)
