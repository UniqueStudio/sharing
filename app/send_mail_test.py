#encoding: utf-8
from flask import Flask
import share_mail
import time
app = Flask(__name__)
AddressList = [
		'qiguo@hustunqiue.com'
		# 'shengzhang@hustunique.com',
		# '767813944@qq.com',
		# 'pkpk3201654@163.com'
]

with app.app_context():
	start = time.time()
	share_mail.SendMail(app, AddressList, mail_subject='abc', mail_body='<b>Hello Worls</b>')

print time.time() - start
