#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite

import datetime

class Push(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.push)

    def push(self, response):
        """
            推送内容为评论
        """
        pass