import mysql.connector
from mysql.connector import errorcode
import hashlib

try:
    t_id = int(input('Enter transaction id: '))
    p_id = int(input('Enter payer id: '))
    r_id = int(input('Enter receiver id: '))
    t_amount = int(input('Enter transaction amount: '))
    t_datetime = input('Enter datetime: ')
    t_mode = input('Enter mode(demand draft/credit card/debit card/online):')

    # username = input('Enter username : ')
    # pswd = (hashlib.sha1(input('Enter password : ').encode())).hexdigest()
    # cnx = mysql.connector.connect(user=username, password=pswd, host='localhost', database='team_20')
    cnx = mysql.connector.connect(user='root', password='ytterbium', host='localhost', database='team_20')
    myCursor = cnx.cursor(buffered=True)
    myCursor.execute('use team_20')
    x = myCursor.callproc('add_to_transactions_table', (t_id, p_id, r_id, t_amount, t_datetime, t_mode))
    cnx.commit()

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print('Incorrect username/password')
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print('Database does not exist')
    else:
        print(err)

else:
    myCursor.close()
    cnx.close()

finally:
    print('Execution Complete')
