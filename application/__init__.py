#encoding:utf-8
__author__ = 'Bing'

import tornado.web
from tornado.web import url
from application.user import Login, Register, ModifyMyInformation, Homepage, UploadImage, \
    OperateMyShare, OperateMyGroup
from application.base import BaseHandle

class Test(BaseHandle):
    def get(self):
        if self.get_argument('action') == 'create':
            self.get_session()
            self.session['test'] = 'test'
            self.session.save()
        else:
            self.get_session()
            self.write(self.session['test'])

class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            url(r'/login', Login),
            url(r'/register', Register),
            url(r'/modify_info', ModifyMyInformation),
            url(r'/homepage', Homepage),
            url(r'/upload_image', UploadImage),
            url(r'/operate_my_share', OperateMyShare),
            url(r'/operate_my_group', OperateMyGroup),
            url(r'/test', Test)
        ]

        settings = {
            "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
            "login_url": "/login",
            "xsrf_cookies": False,
        }

        tornado.web.Application.__init__(self, handlers, **settings)