#encoding:utf-8

import tornado.testing
from application import Application

class UserTest(tornado.testing.AsyncHTTPTestCase):
    def get_app(self):
        return Application()

    def test_login(self):
        self.http_client.fetch(self.get_url('/login'), self.stop(), method="POST")
        response = self.wait()
        print response