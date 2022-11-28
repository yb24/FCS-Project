from django.core.exceptions import ValidationError
import os

def validate_file_size(value):
    filesize= value.size
    
    if filesize > 512*1024:
        raise ValidationError("File Size too Big")
    else:
        return value

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf','.txt','.png','.jpg','.jpeg']
    if not ext in valid_extensions:
        raise ValidationError(u'File not supported!')