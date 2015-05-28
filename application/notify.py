#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite

import datetime
import json

class Notify(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.notify)

    def notify(self, response):
        """
            获取通知并对通知进行处理
        """
        self.session = self.get_session()
        id = self.session['id']
        if id:
            user = User.objects(id=id).first()
            result = user.notify_content
            self.write(json.dumps(result))