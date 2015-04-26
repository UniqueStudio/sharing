#encoding:utf-8
__author__ = 'bing'

import tornado.web
import tornado.httpclient
from application.base import BaseHandle
from application.models import User, getConnection

getConnection()

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
        if not User.is_exist(email):
            raise User.UserException('没有该用户')
        user = User.objects(email=email).first()
        if not user or not user.check_password(password):
            raise User.UserException('密码不正确')
        else:
            print '登陆成功'
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
        if User.is_exist(email):
            raise User.UserException('Email已经被占用')
        user = User(email=email, password=password, nickname=nickname)
        user.save()
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