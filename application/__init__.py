#encoding:utf-8

import tornado.web
from tornado.web import url
from application.user import (Login,
                              Logout,
                              Register,
                              MyInformation,
                              Homepage,
                              UploadImage,
                              InviteByEmail,
                              Follow,
                              Black,
                              CancelBlack,
                              CancelFollow,
                              AcceptInvite,
                              ApplyGroup,
                              UpdatePassword,
                              )
from application.share_group import (CreateGroup,
                                     GroupInfo,
                                     GroupShare,
                                     GroupUser,
                                     ChangeAdmin,
                                     ApplyUser,
                                     AcceptApply,
                                     RejectApply,
                                     FetchAllGroup,
                                     Expel,
                                     ExitGroup,
                                     GroupInvite,
                                     )
from application.share import (ShareHandler,
                               GratitudeHandler,
                               ShareForwardGroup)
from application.notify import NotifyInfo
from application.comment import CommentHandler
from application.base import BaseHandler
from application.inbox_share import InboxShareHandler


class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            url(r'/login', Login),
            url(r'/logout', Logout),
            url(r'/register', Register),
            url(r'/register/(.*)', Register),
            url(r'/setting', MyInformation),
            url(r'/homepage', Homepage),
            url(r'/upload_image', UploadImage),

            url(r'/user/invite', InviteByEmail),
            url(r'/user/accept/(.*)', AcceptInvite),

            url(r'/user/apply', ApplyGroup),

            url(r'/share', ShareHandler),
            url(r'/inbox_share', InboxShareHandler),
            url(r'/share/forward', ShareForwardGroup),

            url(r'/user/follow', Follow),
            url(r'/user/black', Black),
            url(r'/user/unfollow', CancelFollow),
            url(r'/user/cancel_black', CancelBlack),
            url(r'/user/notify', NotifyInfo),
            url(r'/user/update_passwd', UpdatePassword),

            url(r'/gratitude', GratitudeHandler),
            url(r'/comment', CommentHandler),

            url(r'/group', CreateGroup),
            url(r'/group/all', FetchAllGroup),
            url(r'/group/info', GroupInfo),
            url(r'/group/shares', GroupShare),
            url(r'/group/users', GroupUser),
            url(r'/group/change_admin', ChangeAdmin),
            url(r'/group/apply_users', ApplyUser),
            url(r'/group/accept', AcceptApply),
            url(r'/group/reject', RejectApply),
            url(r'/group/expel', Expel),
            url(r'/group/exit', ExitGroup),
            url(r'/group/invite', GroupInvite),
        ]

        settings = {
            "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
            "login_url": "/login",
            "xsrf_cookies": False,
            "debug": True,
        }

        tornado.web.Application.__init__(self, handlers, **settings)
