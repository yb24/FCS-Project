# Generated by Django 4.0.3 on 2022-11-08 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_mgmt_backend', '0008_user_isotpverified'),
    ]

    operations = [
        migrations.CreateModel(
            name='OtpTableRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userEmail', models.CharField(max_length=50)),
                ('otp', models.CharField(max_length=30)),
                ('timeStamp', models.CharField(max_length=100)),
            ],
        ),
    ]