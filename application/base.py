# encoding:utf-8
__author__ = 'bing'

import tornado.web
import application.help.session

class BaseHandle(tornado.web.RequestHandler):
    session = None
    mrg = application.help.session.MongoSessionManager()

    def get_current_user(self): #接口，测试时候全返回True
        return True

    def get_session(self):
        session_id = self.get_secure_cookie('session_id')
        if not session_id:
            session_id = self.mrg.generate_session_id('abcd')
            self.set_secure_cookie(name='session_id', value=session_id, expires_days=1)
            self.session = self.mrg.create_new(session_id)
        else:
            self.session = self.mrg.load_session(session_id)