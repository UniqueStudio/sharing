#encoding:utf-8
__author__ = 'bing'

import tornado.web
import tornado.httpclient

class Login(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.login)

    def login(self, response):
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        self.write(email + '-' + password)
        self.finish()

class Register(tornado.web.RequestHandler):
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

class Homepage(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_homepage)

    def get_homepage(self, response):
        self.write('homepage_information')
        self.finish()

class ModifyMyInformation(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.modify_information)

    def modify_information(self, response):
        phone_number = self.get_body_argument('phone_number', default=None)
        is_man = self.get_body_argument('is_man', default=True)
        education_information = self.get_body_argument('education_information')
        avatar = self.get_body_argument('avatar')
        brief = self.get_body_argument('brief')
        self.write('modify_information')
        self.finish()