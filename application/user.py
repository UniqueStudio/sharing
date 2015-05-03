#encoding:utf-8
__author__ = 'bing'

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.exception import OperateException
from application.models import User, getConnection, Share, ShareGroup, Comment

import json
import os
import time
import hashlib

getConnection()

class Login(BaseHandler):
    def get(self):
        self.xsrf_token
        print self.get_cookie('_xsrf')
        self.write('未登陆')

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.login)

    def login(self, response):
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        if not User.is_exist(email):
            raise User.UserException('没有该用户')
        user = User.objects(email=email).first()
        if not user or not user.check_password(password):
            raise User.UserException('密码不正确')
        else:
            self.recode_status_login(user)
            print '登陆成功'
        self.finish()

class Register(BaseHandler):
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
        self.recode_status_login(user)
        self.finish()

class Homepage(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_homepage)

    @tornado.web.authenticated
    def get_homepage(self, response):
        self.session = self.get_session()
        id = self.session['_id']
        if id:
            user = User.objects(id=id).first()
            result = {}
            result['nickname'] = user.nickname
            result['email'] = user.email
            result['id'] = str(user.id)
            result['avatar'] = user.avatar
            result['is_man'] = user.is_man
            result['brief'] = user.brief
            result['phone_number'] = user.phone_number
            result['self_shares'] = [str(share.id) for share in user.self_shares]
            result['gratitude_shares'] = [str(share.id) for share in user.gratitude_shares]
            result['comments'] = [str(comment.id) for comment in user.comments]
            result['black_users'] = [str(tmp_user.id) for tmp_user in user.black_users]
            result['attention_users'] = [str(tmp_user.id) for tmp_user in user.attention_users]
            result['groups'] = [str(group.id) for group in user.groups]
            result['manager_groups'] = [str(group.id) for group in user.manager_groups]
            self.write(json.dumps(result))
        else:
            raise User.UserException('该用户未登陆')
        self.finish()

class ModifyMyInformation(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.modify_information)

    @tornado.web.authenticated
    def modify_information(self, response):
        phone_number = self.get_body_argument('phone_number', default=None)
        is_man = self.get_body_argument('is_man', default=True)
        education_information = self.get_body_argument('education_information')
        brief = self.get_body_argument('brief')
        id = self.session['_id']
        if id:
            user = User.objects(id=id).first()
            user.modify_information(is_man=is_man, brief=brief,
                                    education_information=education_information,
                                    phone_number=phone_number)
        else:
            raise User.UserException('该用户未登陆')
        self.write('modify_information')
        self.finish()


class UploadImage(BaseHandler):

    def get(self):
        self.write(
            '''
<html>
  <head><title>Upload File</title></head>
  <body>
    <form action='upload_image' enctype="multipart/form-data" method='post'>
    <input type='file' name='avatar'/><br/>
    <input type='submit' value='submit'/>
    </form>
  </body>
</html>
            '''
        )

    def post(self):
        self.session = self.get_session()
        id = self.session['_id']
        if id:
            user = User.objects(id=id).first()
            upload_path = os.path.join(os.path.dirname(__file__), 'avatar')
            if self.request.files:
                avatar = self.request.files['avatar'][0]
                self.save_file(avatar, upload_path, user)
                print 'success'
        self.write('finish')

    def save_file(self, file, save_dir, user):
        file_name = file['filename'] + str(time.time())
        file_name = hashlib.md5(file_name).hexdigest()
        save_file_name = os.path.join(save_dir, file_name)
        #TODO:对图片进行压缩处理
        with open(save_file_name, 'wb') as up:
            up.write(file['body'])
        user.set_avatar(save_file_name)

class OperateMyShare(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        self.session = self.get_session()
        id = self.session['_id']
        if id:
            user = User.objects(id=id).first()
            operate = self.get_body_argument('operate')
            client = tornado.httpclient.AsyncHTTPClient()
            if operate == 'delete':
                client.fetch(request=self.request, callback=self.delete_share)
            elif operate == 'add':
                client.fetch(request=self.request, callback=self.add_share)
            elif operate == 'gratitude':
                client.fetch(request=self.request, callback=self.gratitude)
            else:
                raise OperateException('没有该操作')
        else:
            raise User.UserException('该用户未登陆')
        self.finish()


    def delete_share(self, response):
        share_id = self.get_body_argument('share_id')
        group_id = self.get_body_argument('group_id')
        share = Share.objects(id=share_id).first()
        group = ShareGroup.objects(id=group_id).first()
        self.write(share.title + ' ' + group.name)
        self.finish()

    def add_share(self, response):
        #TODO:添加一个新的share
        pass

    def gratitude(self, response):
        #TODO:感谢某个share
        pass



class OperateMyGroup(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        self.session = self.get_session()
        id = self.session['_id']
        if id:
            user = User.objects(id=id).first()
            operate = self.get_body_argument('operate')
            client = tornado.httpclient.AsyncHTTPClient()
            if operate == 'quit':
                client.fetch(request=self.request, callback=self.quit_group)
            elif operate == 'accept_invite':
                client.fetch(request=self.request, callback=self.accept_invite_group)
            else:
                raise OperateException('没有该操作')

    def quit_group(self, response):
        #TODO:退组
        pass

    def accept_invite_group(self, response):
        #TODO:接收某个组的邀请
        pass

class Invite(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.invite)

    def invite(self):
        pass
