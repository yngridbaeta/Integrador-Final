# Generated by Django 5.2.2 on 2025-06-10 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sensores',
            name='unidade_medida',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterUniqueTogether(
            name='sensores',
            unique_together={('mac_address', 'sensor')},
        ),
    ]
