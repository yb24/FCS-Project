# Patient Data Management System 
Foundations Of Computer Security | ReactJS, Django, SQLite

This project is made keeping in mind security aspect of App development.

### Functionalities

User Guide: https://docs.google.com/document/d/1MAZbfV-d3yFsYCOWcV02c9yCOBk1jAlNthZgyal6kFM/edit?usp=sharing

- Supports users like patient, healthcare professionals, pharmacies and insurance
- Patients: can upload reports and get consultation from healthcare professionals, order medicines from pharmacy, get insurance claim resolved, pay/receive payments in our CRUD based wallet.
- Healthcare professionals: can upload reports, verify documents for patients and prescribe medicines.
- Pharmacies: add medicines, create bills
- Insurance: add insurances, provide insurance claims
- All the documents can be shared between users and document ownership (to ensure no cdocument can be tampered by anyone) is validated using blockchain technology with pinata cloud services.

## Installation Steps to Run the code on localhost

### Env files
Frontend
```
REACT_APP_BACKEND = http://127.0.0.1:8000/api/user
REACT_APP_FRONTEND = http://127.0.0.1
```

Backend
SECRET_KEY = <django secret key available in Django project>
EMAIL_PWD = <email password for Email id used for sending OTP. You can find email we used in backend>patient_mgmt_backend>views.py file. Use your email there and put password in this field. >
STORAGE_PATH = <path_till_FCS-Project_Folder>/FCS-Project/fcs_project/backend/mediafiles
PINATA_API_KEY = <put your pinata account key>
PINATA_API_SECRET = <put your pinata account secret key>

### Frontend
Go to frontend folder

```
npm install
npm start
```

### Backend
1. Install Django in your system
```
python -m pip install Django
```
2. Run the following commands
 Go to backend folder 
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

Your app is up and running now.

