# Generated by Django 4.0.3 on 2022-11-05 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_mgmt_backend', '0006_paymentrecords'),
    ]

    operations = [
        migrations.CreateModel(
            name='OtpTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userID', models.CharField(max_length=30)),
                ('otp', models.CharField(max_length=30)),
                ('timeStamp', models.CharField(max_length=100)),
            ],
        ),
    ]