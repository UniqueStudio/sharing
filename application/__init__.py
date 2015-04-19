#encoding:utf-8
__author__ = 'Bing'

import tornado.web
from tornado.web import url
from application.user import Login

class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            url(r'/login', Login)
        ]

        tornado.web.Application.__init__(self, handlers)