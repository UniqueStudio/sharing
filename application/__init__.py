#encoding:utf-8
__author__ = 'Bing'

import tornado.web
from tornado.web import url
from application.user import Login, Register, ModifyMyInformation, Homepage, UploadImage, \
    InviteExist, InviteByEmail, Follow, Black, CancelBlack, CancelFollow, AcceptInvite
from application.share_group import CreateGroup, GroupInfo, GroupShare, GroupUser
from application.share import CreateShare, DeleteShare
from application.notify import Notify
from application.base import BaseHandler

class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            url(r'/login', Login),
            url(r'/register', Register),
            url(r'/register/(.*)', Register),
            url(r'/modify_info', ModifyMyInformation),
            url(r'/homepage', Homepage),
            url(r'/upload_image', UploadImage),
            url(r'/user/invite/exist', InviteExist),
            url(r'/user/invite/email', InviteByEmail),
            url(r'/user/invite/accept', AcceptInvite),

            url(r'/share/create', CreateShare),
            url(r'/share/delete', DeleteShare),

            url(r'/follow', Follow),
            url(r'/black', Black),
            url(r'/cancel_follow', CancelFollow),
            url(r'/cancel_black', CancelBlack),
            url(r'/notify', Notify),

            url(r'/group/create', CreateGroup),
            url(r'/group/info', GroupInfo),
            url(r'/group/shares', GroupShare),
            url(r'/group/users', GroupUser),
        ]

        settings = {
            "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
            "login_url": "/login",
            "xsrf_cookies": False,
            "debug": True,
        }

        tornado.web.Application.__init__(self, handlers, **settings)
