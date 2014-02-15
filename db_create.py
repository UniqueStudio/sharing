#encoding: utf-8
'''
该文件用来创建数据库
'''
from app.models import db
from app import app

with app.app_context():
    db.drop_all()
    db.create_all()
