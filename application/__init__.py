#encoding:utf-8
__author__ = 'Bing'

import tornado.web
from tornado.web import url
from application.user import Login, Register, ModifyMyInformation, Homepage, UploadImage, \
    Invite, Follow, Black, CancelBlack, CancelFollow
from application.share_group import CreateGroup
from application.share import ShareHandler
from application.notify import Notify
from application.base import BaseHandler

class Test(BaseHandler):
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
            url(r'/invite', Invite),
            url(r'/test', Test),
            url(r'/share', ShareHandler),
            url(r'/create_group', CreateGroup),
            url(r'/follow', Follow),
            url(r'/black', Black),
            url(r'/cancel_follow', CancelFollow),
            url(r'/cancel_black', CancelBlack),
            url(r'/notify', Notify),
        ]

        settings = {
            "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
            "login_url": "/login",
            "xsrf_cookies": False,
            "debug": True,
        }

        tornado.web.Application.__init__(self, handlers, **settings)
