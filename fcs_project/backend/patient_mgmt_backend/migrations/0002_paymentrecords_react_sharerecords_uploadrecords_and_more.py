# Generated by Django 4.0.3 on 2022-11-01 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_mgmt_backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentRecords',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userID', models.CharField(max_length=30)),
                ('receiverID', models.CharField(max_length=30)),
                ('amount', models.FloatField()),
                ('status', models.CharField(max_length=30)),
                ('Type', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='React',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('detail', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='ShareRecords',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userID', models.CharField(max_length=30)),
                ('receiverID', models.CharField(max_length=30)),
                ('docLink', models.CharField(max_length=100)),
                ('docType', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='UploadRecords',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userID', models.CharField(max_length=30)),
                ('docLink', models.ImageField(upload_to='patient_mgmt_backend/uploaded_files')),
                ('docType', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='UserTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=200)),
                ('name', models.CharField(max_length=200)),
                ('role', models.CharField(default='PT', max_length=50)),
                ('address', models.CharField(default='none', max_length=300)),
                ('contact', models.CharField(default='none', max_length=15)),
                ('vAadhar', models.CharField(default='none', max_length=50)),
                ('healthLicense', models.CharField(default='none', max_length=200)),
                ('description', models.CharField(default='none', max_length=500)),
                ('location', models.CharField(default='none', max_length=200)),
                ('image1Path', models.CharField(default='none', max_length=100)),
                ('image2Path', models.CharField(default='none', max_length=100)),
                ('status', models.CharField(default='NA', max_length=50)),
            ],
        ),
    ]