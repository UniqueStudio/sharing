#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import Share, User
from application.exception import BaseException

import json


class CommentHandler(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /comment?share_id=:share_id 获取评论
        @apiVersion 0.1.1
        @apiName GetComment
        @apiGroup Comment
        @apiPermission login

        @apiDescription 根据share_id获取组内某条share的评论，当is_reply为true时，
        表示此评论为回复，并且有to_uid, to_nickname, to_avatar字段.

        @apiParam {String} share_id Id of share in group.

        @apiSuccess {Object[]} comments Comments of share.
        @apiSuccess {String} comments.id Id of comment.
        @apiSuccess {String} comments.uid Comment.user.id.
        @apiSuccess {String} comments.content Content of comment.
        @apiSuccess {String} comments.time Time of comment.
        @apiSuccess {String} comments.nickname Nickname of user who made this comment.
        @apiSuccess {String} comments.avatar Avatar of user who made this comment.
        @apiSuccess {Boolean} comments.is_reply
        @apiSuccess {String} [comments.to_uid] Reply.to_user.id(available when is_reply is true)
        @apiSuccess {String} [comments.to_nickname] Reply.to_user.nickname(available when is_reply is true)
        @apiSuccess {String} [comments.to_avatar] Reply.to_user.avatar(available when is_reply is true)

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_comment)

    @BaseHandler.sandbox
    def get_comment(self, response):
        user = User.objects(id=self.session['_id']).first()
        share = Share.objects(id=self.get_argument('share_id')).first()
        if share is None or not user.is_in_the_group(share.own_group):
            raise BaseException(u'非法id')
        comments = list()
        for comment in share.comments:
            data = {
                'id': str(comment.id),
                'content': comment.content,
                'time': str(comment.create_time),
                'uid': str(comment.user.id),
                'nickname': comment.user.nickname,
                'avatar': comment.user.avatar,
                'is_reply': False
            }
            if comment.to_user:
                data['is_reply'] = True
                data['to_uid'] = str(comment.to_user.id)
                data['to_nickname'] = comment.to_user.nickname
                data['to_avatar'] = comment.to_user.avatar
            comments.append(data)
        self.write(json.dumps({'comments': comments}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /comment 发布评论/回复
        @apiVersion 0.1.1
        @apiName PostComment
        @apiGroup Comment
        @apiPermission login

        @apiDescription 只能对组内的share发表评论.
        如果有to_user参数，则对该用户进行回复.

        @apiParam {String} share_id Id of share..
        @apiParam {String} content Content of comment.
        @apiParam {String} [to_user] ToUser.id

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_comment)

    @BaseHandler.sandbox
    def create_comment(self, response):
        user = User.objects(id=self.session['_id']).first()
        share_id = self.get_body_argument('share_id')
        share = Share.objects(id=share_id).first()
        if share is None:
            raise BaseException(u'非法id')
        content = self.get_body_argument('content')
        to_user_id = self.get_body_argument('to_user', default=None)
        if to_user_id:
            user.add_reply_to_share(share, content, to_user_id)
        else:
            user.add_comment_to_share(share, content)
        self.write(json.dumps({'message': 'success'}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def delete(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_comment)

    @BaseHandler.sandbox
    def delete_comment(self, response):
        """
        @api {delete} /comment 删除评论/回复
        @apiVersion 0.1.1
        @apiName DeleteComment
        @apiGroup Comment
        @apiPermission login

        @apiDescription 通过comment_id删除评论/回复.

        @apiParam {String} comment_id Id of comment/reply.

        @apiUse SuccessMsg

        @apiUse NotLoginError
        @apiUse OtherError
        """
        user = User.objects(id=self.session['_id']).first()
        user.remove_comment_to_share(self.get_body_argument('comment_id'))
        self.write(json.dumps({'message': 'success'}))
