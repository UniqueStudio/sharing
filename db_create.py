#encoding: utf-8
'''
该文件用来创建数据库
'''
from app import db
from app import app

with app.app_context():
	db.create_all()
