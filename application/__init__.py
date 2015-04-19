#encoding:utf-8
__author__ = 'Bing'

import tornado.web
from tornado.web import url
from application.user import Login, NoLogin, Register, ModifyMyInformation, Homepage

class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            url(r'/login', Login),
            url(r'/nologin', NoLogin),
            url(r'/register', Register),
            url(r'/modify_info', ModifyMyInformation),
            url(r'/homepage', Homepage)
        ]

        settings = {
            "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
            "login_url": "/nologin",
        }

        tornado.web.Application.__init__(self, handlers, **settings)