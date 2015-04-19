# encoding:utf-8
__author__ = 'bing'

import tornado.web

class BaseHandle(tornado.web.RequestHandler):
    def get_current_user(self): #接口，测试时候全返回True
        return True