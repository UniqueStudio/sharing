#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, InboxShare, ShareGroup
from application.exception import BaseException

import json


class InboxShareHandler(BaseHandler):
    """
    @api {post} /share 投递InboxShare（外部）
    @apiVersion 0.1.6
    @apiName PostInboxShare
    @apiGroup InboxShare
    @apiPermission login

    @apiDescription 与投递到某个组的接口几乎相同，仅是groups为空数组.

    @apiParam {String} [title] Title of share.
    @apiParam {String} url Title of share.
    @apiParam {String[]} groups Name of groups to send share.

    @apiUse SuccessMsg

    @apiUse NotLoginError
    @apiUse OtherError
    """
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /inbox_share?inbox_share_id=:inbox_share_id 获取InboxShare
        @apiVersion 0.1.9
        @apiName GetInboxShare
        @apiGroup InboxShare
        @apiPermission login

        @apiDescription 根据inbox_share_id从inbox中获取share，即从`@me`中获取share.

        @apiParam {String} in_share_id Id of share.

        @apiSuccess {String} id Id of share.
        @apiSuccess {String} title Title of share.
        @apiSuccess {String} url Url of share.
        @apiSuccess {String} content 排版后的文章内容
        @apiSuccess {String} send_time Time of share created.
        @apiSuccess {String} nickname Name of user.
        @apiSuccess {String} uid Id of user.
        @apiSuccess {String} avatar Avatar of user.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_inbox_share)

    @BaseHandler.sandbox
    def get_inbox_share(self, response):
        """
        @api {get} /inbox_share 获取所有InboxShare
        @apiVersion 0.1.6
        @apiName GetAllInboxShare
        @apiGroup InboxShare
        @apiPermission login

        @apiDescription 从`@me`中获取所有share.

        @apiSuccess {Object[]} inbox_shares
        @apiSuccess {String} inbox_shares.id Id of share.
        @apiSuccess {String} inbox_shares.title Title of share.
        @apiSuccess {String} inbox_shares.url Url of share.
        @apiSuccess {String} inbox_shares.send_time Time of share created.
        @apiSuccess {String} inbox_shares.nickname Name of user.
        @apiSuccess {String} inbox_shares.uid Id of user.
        @apiSuccess {String} inbox_shares.avatar Avatar of user.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        inbox_share_id = self.get_argument('inbox_share_id', None)
        # 获取一条inbox_share
        if inbox_share_id:
            inbox_share = InboxShare.objects(id=self.get_argument('inbox_share_id')).first()
            if inbox_share is None or inbox_share.own_user.id != self.session['_id']:
                raise BaseException(u'非法id')
            self.write(json.dumps({
                'id': str(inbox_share.id),
                'title': inbox_share.title,
                'url': inbox_share.url,
                'content': inbox_share.passage.html,
                'send_time': str(inbox_share.send_time),
                'nickname': inbox_share.own_user.nickname,
                'uid': str(inbox_share.own_user.id),
                'avatar': inbox_share.own_user.avatar
            }))
        else:
            inbox_shares = [
                {
                    'id': str(inbox_share.id),
                    'title': inbox_share.title,
                    'url': inbox_share.url,
                    'send_time': str(inbox_share.send_time),
                    'nickname': inbox_share.own_user.nickname,
                    'uid': str(inbox_share.own_user.id),
                    'avatar': inbox_share.own_user.avatar
                } for inbox_share in self.current_user.self_inbox_shares
            ]
            self.write(json.dumps({'inbox_shares': inbox_shares}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def put(self):
        """
        @api {put} /inbox_share 推送InboxShare到group
        @apiVersion 0.1.8
        @apiName PutInboxShare
        @apiGroup InboxShare
        @apiPermission login

        @apiDescription 通过inbox_share_id和group_id推送InboxShare到特定的组.

        @apiParam {String} inbox_share_id Id of share.
        @apiParam {String} group_id Id of group.
        @apiParam {String} [comment] 评论

        @apiSuccess {String} message "success"
        @apiSuccess {Boolean} duplicated 如果该组已经有相同url的shr，则返回true，否则返回false

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.send_inbox_share)

    @BaseHandler.sandbox
    def send_inbox_share(self, response):
        user = User.objects(id=self.session['_id']).first()
        inbox_share = InboxShare.objects(id=self.get_body_argument('inbox_share_id')).first()
        group = ShareGroup.objects(id=self.get_body_argument('group_id')).first()
        comment = self.get_body_argument("comment", "")
        if inbox_share is None:
            raise BaseException(u'非法id')
        r = user.send_share(inbox_share, group, comment)
        self.write(json.dumps({"message": "success", "duplicated": r["duplicated"]}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def delete(self):
        """
        @api {delete} /inbox_share 删除InboxShare
        @apiVersion 0.1.0
        @apiName DeleteInboxShare
        @apiGroup InboxShare
        @apiPermission login

        @apiDescription 通过inbox_share_id删除InboxShare, 直接删除.

        @apiParam {String} inbox_share_id Id of share.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_inbox_share)

    @BaseHandler.sandbox
    def delete_inbox_share(self, response):
        user = User.objects(id=self.session['_id']).first()
        inbox_share = InboxShare.objects(id=self.get_body_argument('inbox_share_id')).first()
        if inbox_share is None:
            raise BaseException(u'非法id')
        user.remove_inbox_share(inbox_share)
        self.write(json.dumps({'message': 'success'}))
