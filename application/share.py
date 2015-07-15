#encoding:utf-8

import json
import tornado.web
import tornado.httpclient
from tornado.web import HTTPError
from mongoengine.errors import ValidationError
from application.base import BaseHandler
from application.models import Share, User, ShareGroup, InboxShare
from application.exception import BaseException


class ShareHandler(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /share?share_id=:share_id 获取组内某条share
        @apiVersion 0.1.0
        @apiName GetShare
        @apiGroup Share
        @apiPermission login

        @apiDescription 根据share_id获取组内某条share.

        @apiParam {String} share_id Id of share in group.

        @apiSuccess {String} id Id of share.
        @apiSuccess {String} title Title of share.
        @apiSuccess {String} url Url of share.
        @apiSuccess {String} share_time Time of share created.
        @apiSuccess {Number} comment_sum Sum of comments.
        @apiSuccess {Number} gratitude_sum Sum of users gratitude.
        @apiSuccess {Object} origin First user who made this share.
        @apiSuccess {Object} origin.nickname Name of user.
        @apiSuccess {String} origin.id Id of user.
        @apiSuccess {String} origin.avatar Avatar of user.
        @apiSuccess {String} origin.nickname Name of user.
        @apiSuccess {Object[]} others The rest users.
        @apiSuccess {String} others.nickname Name of user.
        @apiSuccess {String} others.id Id of user.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_share)

    @BaseHandler.sandbox
    def get_share(self, response):
        print '23333333'
        share_id = self.get_argument('share_id')
        print 'share_id'
        share = Share.objects(id=share_id).first()
        if share is None:
            raise BaseException(u'非法id')
        user = User.objects(id=self.session['_id']).first()
        if not user or share.own_group not in user.groups:
            raise BaseException(u'没有权限')
        self.write(json.dumps({
            'id': str(share.id),
            'title': share.title,
            'url': share.url,
            'origin': {
                'nickname': share.share_users[0].nickname,
                'id': str(share.share_users[0].id),
                'avatar': share.share_users[0].avatar
            },
            'others': [{
                'nickname': x.nickname,
                'id': str(x.id)
            } for x in share.share_users[1:]],
            'share_time': str(share.share_time),
            'comment_sum': len(share.comments),
            'gratitude_sum': len(share.gratitude_users)
        }))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /share 投递share（外部）
        @apiVersion 0.1.0
        @apiName PostShare
        @apiGroup Share
        @apiPermission login

        @apiDescription 从外部投递share，如果不选发送组，则发送到@me，
        接口对应inbox_share，这点需**格外注意**

        @apiParam {String} title Title of share.
        @apiParam {String} url Title of share.
        @apiParam {String} [comment] Comment of share.
        @apiParam {String[]} groups Name of groups to send share.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_share)

    @BaseHandler.sandbox
    def create_share(self, response):
        title = self.get_body_argument('title')
        url = self.get_body_argument('url')
        user = User.objects(id=self.session['_id']).first()
        if len(self.get_body_arguments('groups')):
            comment_content = self.get_body_argument('comment', default=None)
            print self.get_body_arguments('groups')
            for name in self.get_body_arguments('groups'):
                group = ShareGroup.objects(name=name).first()
                # if group not exist, skip it.
                if group is None:
                    continue
                user.add_share(url, title, group, comment_content)
                # user.share_to_group(share, group, comment_content)
        else:
            share = InboxShare(title=title, url=url)
            try:
                user.add_inbox_share(share)
            except ValidationError:
                raise BaseException(u'非法url')
        self.write(json.dumps({'message': 'success'}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def delete(self):
        """
        @api {delete} /share 删除share
        @apiVersion 0.1.0
        @apiName DeleteShare
        @apiGroup Share
        @apiPermission login

        @apiDescription 通过share_id删除share.
        组内share的删除动作默认仅减少share users，当分享的人数为0的时候，
        这条share才会删除。

        @apiParam {String} share_id Id of share.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_share)

    @BaseHandler.sandbox
    def delete_share(self, response):
        user = User.objects(id=self.session['_id']).first()
        share_id = self.get_body_argument('share_id')
        share = Share.objects(id=share_id).first()
        if share is None:
            raise BaseException(u'非法id')
        user.remove_share_to_group(share, share.own_group)
        self.write(json.dumps({'message': 'success'}))


class GratitudeHandler(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /gratitude 感谢
        @apiVersion 0.1.0
        @apiName PostGratitude
        @apiGroup Share
        @apiPermission login

        @apiDescription 通过share_id向别人投递感谢，感谢成功后发送通知给对方.
        share必须为组分享到内的share

        @apiParam {String} share_id Id of share.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.post_gratitude)

    @BaseHandler.sandbox
    def post_gratitude(self, response):
        user = User.objects(id=self.session['_id']).first()
        share = Share.objects(id=self.get_body_argument('share_id')).first()
        if share is None or not user.is_in_the_group(share.own_group):
            raise BaseException(u'非法id')
        user.gratitude(share)
        self.write(json.dumps({'message': 'success'}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def delete(self):
        """
        @api {delete} /gratitude 取消感谢
        @apiVersion 0.1.0
        @apiName DeleteGratitude
        @apiGroup Share
        @apiPermission login

        @apiDescription 通过share_id取消感谢.

        @apiParam {String} share_id Id of share.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_gratitude)

    @BaseHandler.sandbox
    def delete_gratitude(self, response):
        user = User.objects(id=self.session['_id']).first()
        share = Share.objects(id=self.get_body_argument('share_id')).first()
        if share is None or not user.is_in_the_group(share.own_group):
            raise BaseException(u'非法id')
        user.cancel_gratitude(share)
        self.write(json.dumps({'message': 'success'}))


class ShareForwardGroup(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.forward_share)

    @BaseHandler.sandbox
    def forward_share(self, response):
        """
        @api {post} /share/forward 投递share（转发）
        @apiVersion 0.1.1
        @apiName ForwardShare
        @apiGroup Share
        @apiPermission login

        @apiDescription 从信息流中转发share，如果不选发送组（即groups为空数组），则发送到@me

        @apiParam {String} share_id share.id
        @apiParam {String} [comment] Comment of share.
        @apiParam {String[]} groups Name of groups to send share.

        @apiParamExample {form-data} Request-Example
            {
                "share_id": "",
                "comment": "",
                "groups": [
                    ""
                ]
            }

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        share = Share.objects(id=self.get_body_argument('share_id')).first()
        user = User.objects(id=self.session['_id']).first()
        if share.own_group not in user.groups:
            print 'HTTPError(403)'
            raise HTTPError(403)
        print "len(self.get_body_arguments('groups'))", len(self.get_body_arguments('groups'))
        if len(self.get_body_arguments('groups')):
            comment_content = self.get_body_argument('comment', default=None)
            print self.get_body_arguments('groups')
            for name in self.get_body_arguments('groups'):
                group = ShareGroup.objects(name=name).first()
                # if group not exist, skip it.
                if group is None:
                    continue
                user.add_share(share.url, share.title, group, comment_content)
                # user.share_to_group(share, group, comment_content)
        else:
            share = InboxShare(title=share.title, url=share.url)
            try:
                user.add_inbox_share(share)
            except ValidationError:
                raise BaseException(u'非法url')
        self.write(json.dumps({'message': 'success'}))
