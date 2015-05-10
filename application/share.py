#encoding:utf-8

import json
import tornado.web
import tornado.httpclient
from mongoengine.errors import ValidationError
from application.base import BaseHandler
from application.exception import OperateException
from application.models import Share, User, ShareGroup, InboxShare

class ShareHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        self.write('share content')

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        operate = self.get_body_argument('operate')
        if operate == 'add':
            client.fetch(request=self.request, callback=self.add_share)
        else:
            #TODO::Handle exception afterwards
            raise OperateException('Failure in ShareHandler')

    def add_share(self, response):
        title = self.get_body_argument('title')
        comment_content = self.get_body_argument('comment', default=None)
        url = self.get_body_argument('url')
        user = User.objects(id=self.session['_id']).first()
        if len(self.get_body_arguments('groups')):
            #TODO:检查是否能加入这条share
            share = Share(title=title, url=url).save()
            if comment_content:
                user.add_comment_to_share(share, comment_content)
            for name in self.get_body_arguments('groups'):
                group = ShareGroup.objects(name=name).first()
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

    def delete_share(self, response):
        pass
