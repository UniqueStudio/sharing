#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler

class ShareHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        self.write('share content')

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
