# encoding:utf-8
__author__ = 'bing'

import tornado.web
import application.help.session

class BaseHandler(tornado.web.RequestHandler):
    session = None
    mrg = application.help.session.MemcacheSessionManager()

    def get_current_user(self): #接口，测试时候全返回True
        #TODO:测试session存在以判断当前是否有user登陆
        self.get_session()
        return True if self.session['_id'] else False

    def get_session(self):
        session_id = self.get_secure_cookie('session_id')

        def create_session():
            session_id = self.mrg.generate_session_id('abcd')
            self.set_secure_cookie(name='session_id', value=session_id, expires_days=None)
            self.session = self.mrg.create_new(session_id)

        if not session_id:
            create_session()
        else:
            self.session = self.mrg.load_session(session_id)
            if not self.session:
                create_session()

        return self.session

    def recode_status_login(self, user):
        """
            记录user登陆状态
        """
        self.session = self.get_session()
        self.session['nickname'] = user.nickname
        self.session['_id'] = user.id
        self.session['email'] = user.email
        self.session.save()
