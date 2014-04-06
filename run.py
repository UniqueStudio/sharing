#encoding: utf-8
from app import app
from app.scheduler import send_mail

if __name__ == '__main__':
    # send_mail()
    app.run(debug = True, port=8000)
