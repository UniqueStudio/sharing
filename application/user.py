#encoding:utf-8
__author__ = 'bing'

import tornado.web
import tornado.httpclient
from application.base import BaseHandle

class Login(BaseHandle):
    def get(self):
        self.xsrf_token
        print self.get_cookie('_xsrf')
        self.write('未登陆')

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.login)

    @tornado.web.authenticated
    def login(self, response):
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        self.write(email + '-' + password)
        self.finish()

class Register(BaseHandle):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.register)

    def register(self, response):
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        nickname = self.get_body_argument('nickname')
        phone_number = self.get_body_argument('phone_number', default=None)
        is_man = self.get_body_argument('is_man', default=True)
        education_information = self.get_body_argument('education_information')
        avatar = self.get_body_argument('avatar')
        brief = self.get_body_argument('brief')
        inviter = self.get_body_argument('inviter')
        self.write(email)
        self.finish()

class Homepage(BaseHandle):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_homepage)

    @tornado.web.authenticated
    def get_homepage(self, response):
        self.write('homepage_information')
        self.finish()

class ModifyMyInformation(BaseHandle):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.modify_information)

    @tornado.web.authenticated
    def modify_information(self, response):
        phone_number = self.get_body_argument('phone_number', default=None)
        is_man = self.get_body_argument('is_man', default=True)
        education_information = self.get_body_argument('education_information')
        avatar = self.get_body_argument('avatar')
        brief = self.get_body_argument('brief')
        self.write('modify_information')
        self.finish()