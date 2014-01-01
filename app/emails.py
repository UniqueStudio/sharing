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
