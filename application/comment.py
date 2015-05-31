#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.exception import OperateException
from application.models import Share, User, Comment


class CreateComment(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_comment)

    def create_comment(self, response):
        user = User.objects(id=self.session['_id']).first()
        share_id = self.get_body_argument('share_id')
        share = Share.objects(id=share_id).first()
        if share is None:
            self.write(json.dumps({'message': 'illegal share ID'}))
        else:
            #!TODO: handle exceptions
            content = self.get_body_argument('comment')
            user.add_comment_to_share(share, content)
            self.write('ok')
        self.finish()


class DeleteComment(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_comment)

    def delete_comment(self, response):
        user = User.objects(id=self.session['_id']).first()
        #!TODO: handle exceptions
        user.remove_comment_to_share(self.get_body_argument('comment_id'))
        self.write('ok')
        self.finish()
