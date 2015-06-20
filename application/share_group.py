# encoding:utf-8

from application.base import BaseHandler
from application.models import User, Share, ShareGroup

import tornado.web
import json


class CreateGroup(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group 新建一个share组
        @apiVersion 0.1.0
        @apiName CreateGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 首先检查是否有相同名字的组，如果没有，则直接创建该组，
        执行此操作的人自动成为管理员。否则报错。

        @apiParam {String} name     the name of group to be created.

        @apiUse MessageSuccess

        @apiError GroupExist The group exists.
        @apiErrorExample Response:
            HTTP/1.1 200 OK
            {
              "message": "failure",
              "reason": "该组已存在"
            }
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_group)

    def create_group(self, response):
        name = self.get_body_argument('name')
        self.session = self.get_session()
        user_id = self.session['_id']
        create_user = User.objects(id=user_id).first()
        message = self.local_create_group(group_name=name, create_user=create_user)
        self.write(message)
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
                               'reason': u'该组已存在'})

    @tornado.web.asynchronous
    def get(self):
        """
        @api {get} /group 搜索share组
        @apiVersion 0.1.0
        @apiName GetGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 根据id或者name来搜索group信息,两个之间必须提供一个条件.

        @apiParam {String} [name]     the name of group.
        @apiParam {String} [id]       the id of group.

        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.
        @apiSuccess {String} create_time The time of group created.

        @apiUse GroupNotExistError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.query_group)

    def query_group(self, response):
        group_id = self.get_argument('group_id')
        if not group_id:
            group_name = self.get_argument('group_name')
            group = ShareGroup.objects(name=group_name).first()
        else:
            group = ShareGroup.objects(id=group_id).first()
        if group:
            result = dict()
            result['group_name'] = group.name
            result['group_id'] = str(group.id)
            result['create_time'] = str(group.create_time)
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': u'该组不存在'}))
        self.finish()


class GroupInfo(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/info 查询share组信息，包括成员
        @apiVersion 0.1.0
        @apiName GetGroupInfo
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据id或者name来搜索group信息,两个之间必须提供一个条件.

        @apiParam {String} [name]     the name of group.
        @apiParam {String} [id]       the id of group.

        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.
        @apiSuccess {String} create_time The time of group created.
        @apiSuccess {Object} admin Admin of the group.
        @apiSuccess {String} admin.name The name of admin.
        @apiSuccess {String} admin.id The id of admin.
        @apiSuccess {Object[]} users Users in the group.
        @apiSuccess {String} users.name The name of users.
        @apiSuccess {String} users.id The id of users.

        @apiUse GroupNotExistError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_info)

    def show_info(self, response):
        self.session = self.get_session()
        group_id = self.get_argument('group_id')
        if not group_id:
            group_name = self.get_argument('group_name')
            group = ShareGroup.objects(name=group_name).first()
        else:
            group = ShareGroup.objects(id=group_id).first()
        user = User.objects(id=self.session['_id']).first()
        if group and user and user.is_in_the_group(group=group):
            result = dict()
            result['group_name'] = group.name
            result['group_id'] = str(group.id)
            result['admin'] = dict()
            result['admin']['name'] = group.create_user.nickname
            result['admin']['id'] = str(group.create_user.id)
            result['create_time'] = str(group.create_time)
            result['users'] = [{'name': user.nickname, 'id': str(user.id)} for user in group.users]
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': u'该组不存在'}))
        self.finish()


class GroupShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/shares 获取组内的share.
        @apiVersion 0.1.0
        @apiName GetGroupShare
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id获取组内share.

        @apiParam {String} id The id of group.

        @apiSuccess {Object[]} shares Shares in the group.
        @apiSuccess {String} shares.title The title of shares.
        @apiSuccess {String} shares.id The id of shares.

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
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
                    result = [
                        {
                            'title': share.title,
                            'id': str(share.id)
                        } for share in shares]
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
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/users 获取组内的user信息.
        @apiVersion 0.1.0
        @apiName GetGroupUser
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id获取组内user.

        @apiParam {String} id The id of group.

        @apiSuccess {Object[]} users Users in the group.
        @apiSuccess {String} users.name The name of users.
        @apiSuccess {String} users.id The id of users.

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
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
                    result = [
                        {
                            'name': user.nickname,
                            'id': str(user.id)
                        } for user in users]
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
    @tornado.web.authenticated
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
    @tornado.web.authenticated
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
    @tornado.web.authenticated
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
    @tornado.web.authenticated
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
