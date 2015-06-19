#encoding:utf-8

import json
import tornado.web
import tornado.httpclient
from mongoengine.errors import ValidationError
from application.base import BaseHandler
from application.exception import OperateException
from application.models import Share, User, ShareGroup, InboxShare


class GetShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_share)

    def get_share(self, response):
        user = User.objects(id=self.session['_id']).first()
        self.write(str(json.dumps({
            'self_shares' : map(lambda o: json.loads(o.to_json()), user.self_shares),
            'self_inbox_shares' : map(lambda o: json.loads(o.to_json()), user.self_inbox_shares),
            'gratitude_shares' : map(lambda o: json.loads(o.to_json()), user.gratitude_shares)
        }, indent=4)))
        self.finish()


class CreateShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_share)

    def create_share(self, response):
        title = self.get_body_argument('title')
        url = self.get_body_argument('url')
        user = User.objects(id=self.session['_id']).first()
        if len(self.get_body_arguments('groups')):
            comment_content = self.get_body_argument('comment', default=None)
            print self.get_body_arguments('groups')
            share = Share(title=title, url=url).save()
            if comment_content:
                user.add_comment_to_share(share, comment_content)
            for name in self.get_body_arguments('groups'):
                group = ShareGroup.objects(name=name).first()
                # if grouop not exist, skip it.
                if group is None:
                    continue
                user.share_to_group(share, group)
        else:
            share = InboxShare(title=title, url=url)
            try:
                user.add_inbox_share(share)
            except ValidationError:
                self.write(json.dumps({'message': 'illegal url'}))
        self.write('ok')
        self.finish()


class DeleteShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.delete_share)

    def delete_share(self, response):
        user = User.objects(id=self.session['_id']).first()
        share_id = self.get_body_argument('share_id')
        if self.get_body_argument('type') == 'inbox':
            inbox_share = InboxShare.objects(id=share_id).first()
            if inbox_share is None:
                msg = 'no such inbox_share'
            else:
                user.remove_inbox_share(inbox_share)
                msg = 'ok, inbox_share deleted'
        else:
            share = Share.objects(id=share_id).first()
            if share is None:
                msg = 'no such share'
            else:
                user.remove_share_to_group(share, share.own_group)
                msg = 'ok, share deleted'
        self.write(msg)
        self.finish()


