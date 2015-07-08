#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User
from application.utils.notify import NotifyItem

import json


class NotifyInfo(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_notify)

    @BaseHandler.sandbox
    def get_notify(self, response):
        """
        @api {get} /user/notify 获取通知（测试用）
        @apiVersion 0.1.0
        @apiName GetNotify
        @apiGroup User
        @apiPermission login

        @apiDescription 获取未读的所有通知.
        notify_type包括:`COMMENT`, `SHARE`, `FOLLOW`, `GRATITUDE`,
        `ADMIN`, `INVITE`, `FRESH_MEMBER`.

        @apiSuccess {Object[]} notifies Notifies of user.
        @apiSuccess {String} notifies.notify Check examples below for detail.

        @apiSuccessExample COMMENT
            //别人对自己的share的评论

            HTTP/1.1 200 OK
            {
                "notify_type": "COMMENT",
                "time": time,
                "comment_id": comment.id,
                "title": share.title,
                "content": comment.content,
                "user_id": comment.user.id,
                "nickname": comment.user.nickname,
                "avatar": comment.user.avatar
            }

        @apiSuccessExample SHARE
            //关注的人发送的share

            HTTP/1.1 200 OK
            {
                "notify_type": "SHARE",
                "time": time,
                "share_id": share.id,
                "title": share.title,
                "user_id": share.user.id,
                "nickname": share.user.nickname,
                "avatar": share.user.avatar
            }

        @apiSuccessExample FOLLOW
            //增加粉丝

            HTTP/1.1 200 OK
            {
                "notify_type": "FOLLOW",
                "time": time,
                "user_id": user.id,
                "nickname": user.nickname,
                "avatar": user.avatar
            }

        @apiSuccessExample GRATITUDE
            //收到感谢

            HTTP/1.1 200 OK
            {
                "notify_type": "GRATITUDE",
                "time": time,
                "title": share.title,
                "user_id": user.id,
                "nickname": user.nickname,
                "avatar": user.avatar
            }

        @apiSuccessExample ADMIN
            //管理员变更

            HTTP/1.1 200 OK
            {
                "notify_type": "ADMIN",
                "time": time,
                "group_id": group.id,
                "group_name": group.name,
                "user_id": new_admin.id,
                "nickname": new_admin.nickname,
                "avatar": new_admin.avatar
            }

        @apiSuccessExample INVITE
            //收到加组邀请

            HTTP/1.1 200 OK
            {
                "notify_type": "INVITE",
                "time": time,
                "key": invite.key,
                "group_id": group.id,
                "group_name": group.name,
                "user_id": inviter.id,
                "nickname": inviter.nickname,
                "avatar": inviter.avatar
            }

        @apiSuccessExample FRESH_MEMBER
            //新人入组

            HTTP/1.1 200 OK
            {
                "notify_type": "FRESH_MEMBER",
                "time": time,
                "group_id": group.id,
                "group_name": group.name,
                "user_id": user.id,
                "nickname": user.nickname,
                "avatar": user.avatar
            }

        @apiUse NotLoginError
        """
        user = User.objects(id=self.session['_id']).first()
        result = dict(notifies=list())
        for notify in user.notify_content:
            result["notifies"].append(NotifyItem(notify).load_notify())
        print result
        self.write(json.dumps(result))
