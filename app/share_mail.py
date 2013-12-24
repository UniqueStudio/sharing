#encoding: utf-8
from flask import Flask
from flask_mail import Mail
from flask_mail import Message
import threading
# 初始化邮件配置
from config import mail_config

# Basic Thread Class for mailing extended from threading.Thread
class MailThread(threading.Thread):
	def __init__(self, app, msg):
		assert isinstance(app, Flask)
		assert isinstance(msg, Message)
		app.config.update(mail_config)
		super(MailThread, self).__init__()
		self.__mail__ = Mail(app)
		self.__msg__ = msg

	def run(self):
		self.__mail__.send(self.__msg__)

def SendMail(app, AddressList, **args):
	ThreadList = []
	for address in AddressList:
		msg = Message(subject=args['mail_subject'], html=args['mail_body'], recipients=list(address),
				sender='uniqueguoqi@gmail.com')
		mail = MailThread(app, msg)
		ThreadList.append(mail)
		mail.start()
	for mailthread in ThreadList:
		mailthread.join()
	#log success



