# encoding:utf-8

from application.base import BaseHandler
from application.models import User, Share, ShareGroup
from application.exception import BaseException

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

    @BaseHandler.sandbox
    def create_group(self, response):
        name = self.get_body_argument('name')
        self.session = self.get_session()
        user_id = self.session['_id']
        create_user = User.objects(id=user_id).first()
        message = self.local_create_group(group_name=name, create_user=create_user)
        self.write(message)

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
        @api {get} /group?group_name=:group_name 搜索share组
        @apiVersion 0.1.0
        @apiName GetGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 根据name来搜索group信息.

        @apiParam {String} group_name The name of group.

        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.
        @apiSuccess {String} create_time The time of group created.

        @apiUse GroupNotExistError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.query_group)

    @BaseHandler.sandbox
    def query_group(self, response):
        group_name = self.get_argument('group_name')
        group = ShareGroup.objects(name=group_name).first()
        if group:
            result = dict()
            result['group_name'] = group.name
            result['group_id'] = str(group.id)
            result['create_time'] = str(group.create_time)
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': u'该组不存在'}))


class GroupInfo(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/info?[group_id|group_name]=[:group_id|:group_name] 查询组信息，包括成员
        @apiVersion 0.1.0
        @apiName GetGroupInfo
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id或者group_name来搜索group信息,两个之间必须提供一个条件.
        即group_id=组id，group_name=组名.

        @apiParam {String} [group_name]     the name of group.
        @apiParam {String} [group_id]       the id of group.

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

    @BaseHandler.sandbox
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


class GroupShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/shares?group_id=:group_id 获取组内的share
        @apiVersion 0.1.0
        @apiName GetGroupShare
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id获取组内share.

        @apiParam {String} group_id The id of group.

        @apiSuccess {Object[]} shares Shares in the group.
        @apiSuccess {String} shares.title The title of shares.
        @apiSuccess {String} shares.id The id of shares.
        @apiSuccess {String} shares.share_time Time when share first made.
        @apiSuccess {Number} shares.comment_sum The sum of comments.
        @apiSuccess {Object} shares.origin First author of this share.
        @apiSuccess {String} shares.origin.nickname Name of first author.
        @apiSuccess {String} shares.origin.id Id of first author.
        @apiSuccess {String} shares.origin.avatar Avatar of first author.
        @apiSuccess {Object[]} shares.origin.others The rest of user who shared it.
        @apiSuccess {String} shares.origin.others.id Id of user.
        @apiSuccess {String} shares.origin.others.nickname Name of user.

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_shares)

    @BaseHandler.sandbox
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
                    result = {
                        'shares': [{
                            'title': share.title,
                            'id': str(share.id),
                            'origin': {
                                'nickname': share.share_users[0].nickname,
                                'id': str(share.share_users[0].id),
                                'avatar': share.share_users[0].avatar
                            },
                            'others': [
                                {
                                    'nickname': person.nickname,
                                    'id': str(person.id)
                                } for person in share.share_users[1:]
                            ],
                            'comment_sum': len(share.comments),
                            'share_time': str(share.share_time)
                        } for share in shares]
                    }
                    self.write(json.dumps(result))
                else:
                    self.write(json.dumps({'message': 'failure',
                                           'reason': '该用户不是该组成员/或未登陆'}))
            else:
                self.write(json.dumps({'message': 'failure',
                                       'reason': '该组不存在'}))


class GroupUser(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/users?group_id=:group_id 获取组内的user信息
        @apiVersion 0.1.0
        @apiName GetGroupUser
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id获取组内user.

        @apiParam {String} group_id The id of group.

        @apiSuccess {String} admin_id The id of admin.
        @apiSuccess {Object[]} users Users in the group.
        @apiSuccess {String} users.name The name of users.
        @apiSuccess {String} users.id The id of users.
        @apiSuccess {String} users.avatar The avatar of users.
        @apiSuccess {Number} users.gratitude_shares_sum The sum of gratitude.
        @apiSuccess {Number} users.share_sum The num of shares.


        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_user)

    @BaseHandler.sandbox
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
                    result = {
                        'admin_id': str(group.create_user.id),
                        'users': [{
                            'name': user.nickname,
                            'id': str(user.id),
                            'avatar': user.avatar,
                            'gratitude_shares_sum': len(user.gratitude_shares),
                            'share_sum': len(user.self_shares)
                        } for user in users]
                    }
                    self.write(json.dumps(result))
                else:
                    self.write(json.dumps({'message': 'failure',
                                           'reason': '该用户不是该组成员/或未登陆'}))
            else:
                self.write(json.dumps({'message': 'failure',
                                       'reason': '该组不存在'}))


class ChangeAdmin(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group/change_admin 管理员转让
        @apiVersion 0.1.0
        @apiName ChangeAdmin
        @apiGroup ShareGroup
        @apiPermission admin

        @apiDescription 管理员通过可以转让管理员的职位给组员.

        @apiParam {String} group_id The id of group.
        @apiParam {String} user_id The id of user.

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.change_admin)

    @BaseHandler.sandbox
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


class ApplyUser(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/apply_users?group_id=:group_id 获取申请入组的人员
        @apiVersion 0.1.0
        @apiName ApplyUser
        @apiGroup ShareGroup
        @apiPermission admin

        @apiDescription 根据group_id获取组内申请入组人员的信息.

        @apiParam {String} group_id The id of group.

        @apiSuccess {Object[]} users Users in the group.
        @apiSuccess {String} users.nickname The name of users.
        @apiSuccess {String} users.id The id of users.

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_apply_user)

    @BaseHandler.sandbox
    def show_apply_user(self, response):
        group_id = self.get_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        if group is None:
            raise BaseException(u'该组不存在')
        self.session = self.get_session()
        user_id = self.session['_id']
        user = User.objects(id=user_id).first()
        if user and user.is_admin(group=group):
            self.write(json.dumps({'users': [
                {
                    'id': str(invitee.id),
                    'nickname': invitee.nickname
                }
                for invitee in group.apply_users]}))
        else:
            raise BaseException(u'用户权限不足')


class AcceptApply(BaseHandler):
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group/accept 同意入组
        @apiVersion 0.1.0
        @apiName AcceptApply
        @apiGroup ShareGroup
        @apiPermission admin

        @apiDescription 管理员通过入组申请.

        @apiParam {String} group_id The id of group.
        @apiParam {String} apply_user_id The id of user.

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.accept_apply)

    @BaseHandler.sandbox
    def accept_apply(self, response):
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        if group is None:
            raise BaseException(u'该组不存在')
        self.session = self.get_session()
        user_id = self.session['_id']
        user = User.objects(id=user_id).first()
        if user and user.is_admin(group=group):
            apply_user_id = self.get_body_argument('apply_user_id')
            apply_user = User.objects(id=apply_user_id).first()
            group.accept_apply(apply_user)
            self.write(json.dumps({'message': 'success'}))
        else:
            raise BaseException('用户权限不足')


class RejectApply(BaseHandler):
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group/reject 拒绝入组
        @apiVersion 0.1.0
        @apiName RejectApply
        @apiGroup ShareGroup
        @apiPermission admin

        @apiDescription 管理员拒绝入组申请.

        @apiParam {String} group_id The id of group.
        @apiParam {String} apply_user_id The id of user.

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.reject_apply)

    @BaseHandler.sandbox
    def reject_apply(self, response):
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        if group is None:
            raise BaseException(u'该组不存在')
        self.session = self.get_session()
        user_id = self.session['_id']
        user = User.objects(id=user_id).first()
        if user and user.is_admin(group=group):
            apply_user_id = self.get_body_argument('apply_user_id')
            apply_user = User.objects(id=apply_user_id).first()
            group.reject_apply(apply_user)
            self.write(json.dumps({'message': 'success'}))
        else:
            raise BaseException('用户权限不足')
