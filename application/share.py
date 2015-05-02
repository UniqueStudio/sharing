#encoding:utf-8

import json
import tornado.web
import tornado.httpclient
from mongoengine.errors import ValidationError
from application.base import BaseHandler
from application.exception import OperateException
from application.models import Share, User, ShareGroup

class ShareHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        self.write('share content')

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        origin = self.get_body_argument('origin')
        if origin == 'outside':
            client.fetch(request=self.request, callback=self.add_from_outside)
        elif origin == 'inside':
            client.fetch(request=self.request, callback=self.add_from_inside)
        else:
            raise OperateException('Failure in ShareHandler')

    def add_from_outside(self, response):
        title = self.get_body_argument('title')
        comment = self.get_body_argument('comment', default=None)
        url = self.get_body_argument('url')
        share = Share(title=title, url=url)
        try:
            share.save()
        except ValidationError:
            self.write(json.dumps({'message': 'illegal url'}))
            self.finish()
        user = User.objects(id=self.session['_id']).first()
        if comment:
            user.add_comment_to_share(share, comment)
        for name in self.get_body_arguments('groups'):
            print 'add to', name
            group = ShareGroup.objects(name=name).first()
            if group is None:
                continue
            user.share_to_group(share, group)
        else:
            print 'add to default group'
            user.share_to_default_group(share)
        user.save()
        self.write('ok')
        self.finish()

    def add_from_inside(self, response):
        pass
