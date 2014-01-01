<<<<<<< HEAD
#encoding: utf-8
from flask import Flask, copy_current_request_context
from flask_mail import Mail
from flask_mail import Message
from decorates import async
from config import mail_config

app = Flask(__name__)
app.config.update(mail_config)
mail = Mail(app)

def create_messsage(subject='', recipients=[], sender=None):
    msg = Message(subject, recipients=recipients, sender=sender)
    msg.body = "asdg"
    return msg

@async
@copy_current_request_context
def send_async_mail(msg):
    mail.send(msg)

@app.route('/mail')
def send():
    msg = create_messsage('abc', ['qiguo@hustunique.com'], sender="uniqueguoqi@gmail.com")
    send_async_mail(msg)


with app.test_request_context('/mail'):
    send()
=======
#encoding:utf-8
import smtplib 
from email.mime.text import MIMEText
from threading import Thread
from flask import render_template


def share_mail(shares):
    mail_body = render_template('share_mail.html',
            shares = shares)
    print mail_body

    msg = MIMEText(mail_body,'html', 'utf-8')
    msg['Subject'] = 'sharing everyday'
    msg['From'] = 'sharing@gmail.com'
    msg['To'] = 'you'
    thr = Thread(target = send_email, args = [msg.as_string()])
    thr.start()

def test_mail():
    msg = MIMEText("i love you")
    msg['Subject'] = 'test'
    msg['From'] = 'sharing@gmail.com'
    msg['To'] = 'you'
    thr = Thread(target = send_email, args = [msg.as_string()])
    thr.start()

def send_email(msg):

    mailserver = smtplib.SMTP("smtp.gmail.com", 587) 
    mailserver.ehlo() 
    mailserver.starttls() 
    mailserver.ehlo() 
    mailserver.login("kabsky9@gmail.com", "jalmoeijckdptkos") 
    mailserver.sendmail("kabsky9@gmail.com", 
    ["kabsky9@gmail.com","948282320@qq.com"], msg) 
    mailserver.close() 
>>>>>>> b40ecfcf8630474768e33303c3cd4dd729629583
