# encoding:utf-8
__author__ = 'bing'
import os
import time
from hashlib import sha1
import pickle

class SessionManageBase(object):
    """
        session manager的基类
    """
    def generate_session_id(self, salt):
        """
            生成session_id
        """
        rand = os.urandom(16)
        now = time.time()
        return sha1("%s%s%s" % (rand, now, salt)).hexdigest()

    def create_new(self, session_id):
        """
            如果没有session创建
        """
        raise NotImplementedError

    def save_session(self, session):
        """
            保存session
        """
        raise NotImplementedError

    def load_session(self, session_id=None):
        """
            根据session_id加载session
        """
        raise NotImplementedError

class BaseSession(dict):
    def __init__(self, session_id='', mgr=None, data={}, *args, **kwargs):
        super(BaseSession, self).__init__(*args, **kwargs)
        self.__session_id = session_id
        self.__mgr = mgr
        self.update(data)
        self.__change = False   # 小小的优化， 如果session没有改变， 就不用保存了

    def get_session_id(self):
        return self.__session_id

    def save(self):
        if self.__change:
            self.__mgr.save_session(self)
            self.__change = False

    # 使用session[key] 当key不存在时返回None， 防止出现异常
    def __missing__(self, key):
        return None

    def __delitem__(self, key):
        if key in self:
            del self[key]
            self.__change = True

    def __setitem__(self, key, val):
        self.__change = True
        super(BaseSession, self).__setitem__(key, val)

class MongoSessionManager(SessionManageBase):
    def __init__(self):
        import pymongo
        conn = pymongo.Connection("localhost", 27017)
        db = conn['session_manager']
        self._collection = db['session']

    def save_session(self, session):
        self._collection.save({'_id':session.get_session_id(), 'data':session})

    def create_new(self, session_id):
        return BaseSession(session_id, self, {})

    def load_session(self, session_id=None):
        data = {}   #默认为空的session
        if session_id:
            session_data = self._collection.find_one({'_id':session_id})
            if session_data:
                #防止数据错误
                data = session_data['data']

        return BaseSession(session_id, self, data)

class MemcacheSessionManager(SessionManageBase):
    def __init__(self):
        import memcache
        self.conn = memcache.Client(['127.0.0.1:11211'])

    def save_session(self, session):
        session_data = dict(session.items())
        self.conn.set(key=session.get_session_id(), val=session_data, time=60*60*24)

    def create_new(self, session_id):
        return BaseSession(session_id=session_id, mgr=self, data={'create':'test'})

    def load_session(self, session_id=None):
        data = {}
        if session_id:
            session_data = self.conn.get(session_id)
            if session_data:
                data = session_data

        return BaseSession(session_id=session_id, mgr=self, data=data)