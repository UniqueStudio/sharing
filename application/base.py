# encoding:utf-8

import tornado.web
from mongoengine import ValidationError
import application.utils.session
from application.exception import BaseException
import json
import traceback

class BaseHandler(tornado.web.RequestHandler):
    """
    @apiDefine MessageSuccess
    @apiSuccess {String} message     message = success.

    @apiSuccessExample Success-Response:
       HTTP/1.1 200 OK
       {
         "message": "success"
       }
    """
    session = None
    mrg = application.utils.session.MemcacheSessionManager()

    def get_body_argument(self, *args, **kw):
        # handle MissingArgumentError
        try:
            return super(BaseHandler, self).get_body_argument(*args, **kw)
        except tornado.web.MissingArgumentError as e:
            raise BaseException('missing ' + e.arg_name)

    def get_argument(self, *args, **kw):
        # handle MissingArgumentError
        try:
            return super(BaseHandler, self).get_argument(*args, **kw)
        except tornado.web.MissingArgumentError as e:
            raise BaseException('missing ' + e.arg_name)

    def get_current_user(self):
        self.get_session()
        print self.session['_id'], 23333333
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

    @staticmethod
    def sandbox(func):
        def sandbox_wrapper(self, *args, **kw):
            try:
                func(self, *args, **kw)
                self.finish()
            except application.exception.BaseException as e:
                print 'BaseException'
                print traceback.format_exc()
                self.write(json.dumps({
                    'message': 'failure',
                    'reason': e.description
                }))
                self.finish()
            except ValidationError as e:
                print 'ValidationError '
                print traceback.format_exc()
                self.write(json.dumps({
                    'message': 'failure',
                    'reason': e.message
                }))
                self.finish()
            # finally:
            #     self.finish()
        return sandbox_wrapper
