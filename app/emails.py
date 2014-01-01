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
