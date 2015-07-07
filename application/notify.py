#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite
from application.models.notify import COMMENT, SHARE, FOLLOW, GRATITUDE, ADMIN
from application.utils.notify import NofityItem

import json


class NotifyInfo(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_notify)

    @BaseHandler.sandbox
    def get_notify(self, response):
        user = User.objects(id=self.session['_id']).first()
        result = dict(notifies=list())
        for notify in user.notify_content:
            if notify.notify_type == COMMENT:
                result["notifies"].append(NofityItem(notify).load_notify())
        print result
        self.write(json.dumps(result))

    @BaseHandler.sandbox
    def get_otify(self, response):
        """
        @api {get} /user/notify 获取通知（测试用）
        @apiVersion 0.1.0
        @apiName GetNotify
        @apiGroup User
        @apiPermission login

        @apiDescription 获取未读的所有通知.
        notify_type包括`COMMENT`, `SHARE`, `FOLLOW`, `GRATITUDE`, `ADMIN`, `INVITE`.

        @apiSuccess {Object[]} notifies Notifies of user.
        @apiSuccess {String} notifies.notify_id Id of notify.
        @apiSuccess {String} notifies.notify_cid Related id of component in notify.
        @apiSuccess {String} notifies.notify_uid Related id of user in notify.
        @apiSuccess {String} notifies.notify_type Type of notify.
        @apiSuccess {String} notifies.notify_time Time of notify.

        @apiUse NotLoginError
        """
        #TODO:重构
        user = User.objects(id=self.session['_id']).first()
        # result = dict()
        # for notify in user.notify_content:
            # if notify.notify_type == COMMENT:
            #     result[COMMENT] = dict()
            #     comment = Comment.objects(id=notify.notify_id).first()
            #     #以share为键方便同一条share有多条comment通知
            #     key = str(comment.share.id)
            #     if key not in result[COMMENT]:
            #         result[COMMENT][key] = list()
            #     result[COMMENT][key].append(str(notify.id))
            # elif notify.notify_type == SHARE:
            #     result[SHARE] = dict()
            #     #以share的id作为通知的键，一条share一条通知
            #     key = str(notify.notify_id)
            #     if key not in result[SHARE]:
            #         result[SHARE][key] = list()
            #     result[SHARE][key].append(str(notify.id))
            # elif notify.notify_type == FOLLOW:
            #     result[FOLLOW] = dict()
            #     #以登陆用户（被关注的人）的id作为通知的键
            #     key = str(user_id)
            #     if key not in result[FOLLOW]:
            #         result[FOLLOW][key] = list()
            #     result[FOLLOW][key].append(str(notify.id))
            # elif notify.notify_type == GRATITUDE:
            #     result[GRATITUDE] = dict()
            #     #以share的id作为键，一条share多条感谢作为一个通知
            #     key = str(notify.notify_id)
            #     if key not in result[GRATITUDE]:
            #         result[GRATITUDE][key] = list()
            #     result[GRATITUDE][key].append(str(notify.id))
            #     print 233333
            # elif notify.notify_type == ADMIN:
            #     result[ADMIN] = dict()
            #     #以group的id作为键
            #     key = str(notify.notify_id)
            #     if key not in result[ADMIN]:
            #         result[ADMIN][key] = list()
            #     result[ADMIN][key].append(str(notify.id))
        result = dict(notifies=list())
        for notify in user.notify_content:
            result["notifies"].append({
                "notify_id": str(notify.id),
                "notify_cid": str(notify.notify_id),
                "notify_uid": str(notify.notify_user),
                "notify_type": notify.notify_type,
                "notify_time": str(notify.notify_time)
            })
            notify.delete()
        user.notify_content = list()
        user.save()
        self.write(json.dumps(result))
