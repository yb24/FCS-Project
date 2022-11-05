# Generated by Django 4.0.3 on 2022-11-02 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_mgmt_backend', '0003_delete_sharerecords_delete_usertable_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShareRecords',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userID', models.CharField(max_length=30)),
                ('receiverEmail', models.CharField(max_length=30)),
                ('reportID', models.CharField(max_length=30)),
                ('billMade', models.CharField(max_length=30)),
                ('docLink', models.CharField(max_length=100)),
                ('docType', models.CharField(max_length=30)),
            ],
        ),
    ]