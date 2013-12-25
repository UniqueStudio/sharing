#encoding: utf-8
import threading
from flask import copy_current_request_context, Flask
from flask_mail import Mail, Message
from config import mail_config

app = Flask(__name__)
app.config.update(mail_config)
mail = Mail(app)

def create_message(to_email, subject, from_email=None):
    body = 'abcasdg'
    return Message(subject, [to_email], body, sender=from_email)

def send_async(to_email, subject, from_email):
    msg = create_message(to_email, subject, from_email)

    @copy_current_request_context
    def send_message(msg):
        mail.send(msg)

    sender = threading.Thread(name='mail_sender', target=send_message, args=(msg, ))
    sender.start()

send_async('qiguo@hustunique.com', 'helloworld', 'uniqueguoqi@gmail.com')