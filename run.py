#encoding: utf-8
from app import app
from app.scheduler import send_mail, send, cal_delay

if __name__ == '__main__':
    app.run(debug = True, port=4000)
