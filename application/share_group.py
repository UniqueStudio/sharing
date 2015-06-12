# encoding:utf-8

from application.base import BaseHandler
from application.models import User, Share, ShareGroup

import tornado.web
import json


class CreateGroup(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_group)

    def create_group(self, response):
        name = self.get_body_argument('name')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            create_user = User.objects(id=user_id).first()
            message = self.local_create_group(group_name=name, create_user=create_user)
            self.write(message)
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': 'user is not login'}))
        self.finish()

    def local_create_group(self, create_user, group_name):
        if not ShareGroup.is_exist(group_name):
            group = ShareGroup(name=group_name, create_user=create_user)
            group.save()
            create_user.manager_groups.append(group)
            create_user.save()
            create_user.admin_allow_user_entry(create_user, group)
            return json.dumps({'message': 'success'})
        else:
            return json.dumps({'message': 'failure',
                               'reason': 'the group name is existent'})


class GroupInfo(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_info)

    def show_info(self, response):
        group_id = self.get_argument('group_id')
        if group_id:
            group = ShareGroup.objects(id=group_id).first()
            if group:
                result = dict()
                result['group_name'] = group.name
                result['create_user'] = dict()
                result['create_user']['name'] = group.create_user.nickname
                result['create_user']['id'] = str(group.create_user.id)
                result['create_user']['email'] = group.create_user.email
                result['create_time'] = str(group.create_time)
                self.write(json.dumps(result))
            else:
                self.write(json.dumps({'message': 'failure'}))
        self.finish()


class GroupShare(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_shares)

    def get_shares(self, response):
        self.session = self.get_session()
        user_id = self.session['_id']
        user = None
        if user_id:
            user = User.objects(id=user_id).first()
        group_id = self.get_argument('group_id')
        if group_id:
            group = ShareGroup.objects(id=group_id).first()
            if group:
                if user and user.is_in_the_group(group=group):
                    shares = group.shares
                    result = [{share.title: str(share.id)} for share in shares]
                    self.write(json.dumps(result))
                else:
                    self.write(json.dumps({'message': 'failure',
                                           'reason': '该用户不是该组成员/或未登陆'}))
            else:
                self.write(json.dumps({'message': 'failure',
                                       'reason': '该组不存在'}))
        self.finish()


class GroupUser(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_user)

    def get_user(self, response):
        self.session = self.get_session()
        user_id = self.session['_id']
        user = None
        if user_id:
            user = User.objects(id=user_id).first()
        group_id = self.get_argument('group_id')
        if group_id:
            group = ShareGroup.objects(id=group_id).first()
            if group:
                if user and user.is_in_the_group(group=group):
                    users = group.users
                    result = [{user.nickname: str(user.id)} for user in users]
                    self.write(json.dumps(result))
                else:
                    self.write(json.dumps({'message': 'failure',
                                           'reason': '该用户不是该组成员/或未登陆'}))
            else:
                self.write(json.dumps({'message': 'failure',
                                       'reason': '该组不存在'}))
        self.finish()


class ChangeAdmin(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.change_admin)

    def change_admin(self, response):
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        self.session = self.get_session()
        create_user_id = self.session['_id']
        if create_user_id:
            create_user = User.objects(id=create_user_id).first()
            user_id = self.get_body_argument('user_id')  # 接替管理员权限的用户
            user = None
            if user_id:
                user = User.objects(id=user_id).first()
            if user:
                create_user.change_admin(user=user, group=group)
                self.write(json.dumps({'message': 'success'}))
            else:
                self.write(json.dumps({'message': 'failure',
                                       'reason': '所给继承者不存在'}))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': '未登陆'}))
        self.finish()


class ApplyUser(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_apply_user)

    def show_apply_user(self, response):
        group_id = self.get_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        self.session = self.get_session()
        user_id = self.session['_id']
        if not user_id:
            self.write(json.dumps({'message': '请以管理员权限登陆'}))
            self.finish()
        user = User.objects(id=user_id).first()
        if user.is_admin(group=group):
            self.write(json.dumps({'user': group.apply_users}))
        else:
            self.write(json.dumps({'message': '用户权限不足'}))
        self.finish()


class AcceptApply(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.accept_apply)

    def accept_apply(self, response):
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        self.session = self.get_session()
        user_id = self.session['_id']
        if not user_id:
            self.write(json.dumps({'message': '请以管理员权限登陆'}))
            self.finish()
        user = User.objects(id=user_id).first()
        if user.is_admin(group=group):
            apply_user_id = self.get_body_argument('apply_user_id')
            apply_user = User.objects(id=apply_user_id).first()
            try:
                group.accept_apply(apply_user)
                self.write(json.dumps({'message': 'success'}))
            except ShareGroup.GroupException:
                self.write(json.dumps({'message': '无此用户申请信息'}))
        else:
            self.write(json.dumps({'message': '用户权限不足'}))
        self.finish()


class RejectApply(BaseHandler):
    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.reject_apply)

    def reject_apply(self, response):
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        self.session = self.get_session()
        user_id = self.session['_id']
        if not user_id:
            self.write(json.dumps({'message': '请以管理员权限登陆'}))
            self.finish()
        user = User.objects(id=user_id).first()
        if user.is_admin(group=group):
            apply_user_id = self.get_body_argument('apply_user_id')
            apply_user = User.objects(id=apply_user_id).first()
            try:
                group.reject_apply(apply_user)
                self.write(json.dumps({'user': 'success'}))
            except ShareGroup.GroupException:
                self.write(json.dumps({'message': '无此用户申请信息'}))
        else:
            self.write(json.dumps({'message': '用户权限不足'}))
        self.finish()
