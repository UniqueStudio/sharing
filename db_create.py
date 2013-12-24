#encoding: utf-8
'''
该文件用来创建数据库
'''
from app import db
db.drop_all()
db.create_all()
