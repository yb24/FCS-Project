# Generated by Django 4.0.3 on 2022-11-28 14:48

from django.db import migrations, models
import patient_mgmt_backend.validators
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='Email')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('tc', models.BooleanField()),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('role', models.CharField(choices=[('AD', 'Admin'), ('PT', 'Patient'), ('HP', 'HealthcareProfessional'), ('HS', 'Hospital'), ('PH', 'Pharmacy'), ('IF', 'InsuranceFirm')], default='PT', max_length=50)),
                ('address', models.CharField(default='none', max_length=300)),
                ('contact', models.CharField(default='none', max_length=15)),
                ('vAadhar', models.CharField(default='none', max_length=500)),
                ('healthLicense', models.CharField(default='none', max_length=200)),
                ('description', models.CharField(default='none', max_length=500)),
                ('location', models.CharField(default='none', max_length=200)),
                ('image1Path', models.CharField(default='none', max_length=500)),
                ('image2Path', models.CharField(default='none', max_length=500)),
                ('status', models.CharField(choices=[('AU', 'Authenticated'), ('NA', 'NotAuthenticated'), ('RM', 'Removed')], default='NA', max_length=50)),
                ('otp', models.CharField(default='', max_length=300)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OtpTable',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userID', models.CharField(max_length=100)),
                ('otp', models.CharField(max_length=30)),
                ('timeStamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='OtpTableRegistration',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userEmail', models.CharField(max_length=255)),
                ('otp', models.CharField(max_length=30)),
                ('timeStamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentRecords',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('payerID', models.CharField(max_length=100)),
                ('receiverEmail', models.CharField(max_length=255)),
                ('amount', models.FloatField()),
                ('status', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='PendingDocumentRequests',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userID', models.CharField(max_length=100)),
                ('receiverEmail', models.CharField(max_length=255)),
                ('docType', models.CharField(max_length=30)),
                ('date', models.CharField(max_length=30)),
                ('requestCompleted', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('image', models.FileField(upload_to='post_images', validators=[patient_mgmt_backend.validators.validate_file_size, patient_mgmt_backend.validators.validate_file_extension])),
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
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userID', models.CharField(max_length=100)),
                ('receiverEmail', models.CharField(max_length=255)),
                ('reportID', models.CharField(max_length=100)),
                ('billMade', models.CharField(max_length=30)),
                ('docLink', models.CharField(max_length=200)),
                ('docType', models.CharField(max_length=30)),
                ('isVerified', models.CharField(max_length=30)),
                ('fileHash', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UploadRecords',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userID', models.CharField(max_length=100)),
                ('docLink', models.CharField(max_length=200)),
                ('docType', models.CharField(max_length=30)),
                ('isVerified', models.CharField(max_length=30)),
                ('fileHash', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserWallet',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('userID', models.CharField(max_length=100)),
                ('amount', models.FloatField()),
                ('lastAddedMoney', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddConstraint(
            model_name='userwallet',
            constraint=models.CheckConstraint(check=models.Q(('amount__gte', 0)), name='amount_gte_0'),
        ),
    ]
