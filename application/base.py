# encoding:utf-8
__author__ = 'bing'

import tornado.web

class BaseHandle(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie('user_email')