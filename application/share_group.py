# encoding:utf-8

from mongoengine import Q
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Invite
from application.exception import BaseException

import tornado.web
import tornado.httpclient
import urllib
import json


class CreateGroup(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group 新建一个share组
        @apiVersion 0.1.4
        @apiName CreateGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 首先检查是否有相同名字的组，如果没有，则直接创建该组，
        执行此操作的人自动成为管理员。否则报错。

        @apiParam {String} name     the name of group to be created.
        @apiParam {String} intro    introduction of the group

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
        intro = self.get_body_argument('intro')
        message = self.local_create_group(group_name=name, intro=intro, create_user=self.get_current_user())
        self.write(message)

    def local_create_group(self, create_user, group_name, intro):
        if not ShareGroup.is_exist(group_name):
            group = ShareGroup(name=group_name, intro=intro, create_user=create_user)
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
        @apiVersion 0.1.4
        @apiName GetGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 根据name来搜索group信息.

        @apiParam {String} group_name The name of group.

        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.
        @apiSuccess {String} create_time The time of group created.
        @apiSuccess {String} group_intro The intro of group.

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
            result['group_intro'] = group.intro
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': u'该组不存在'}))

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def delete(self):
        """
        @api {delete} /group 管理员解散组
        @apiVersion 0.1.5
        @apiName DestroyGroup
        @apiGroup ShareGroup
        @apiPermission admin


        @apiParam {String} group_id Group.id

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse ForbiddenError
        """
        group = ShareGroup.objects(id=self.get_body_argument('group_id')).first()
        if group is None or not self.current_user.is_admin(group):
            raise tornado.web.HTTPError(403)
        for share in group.shares:
            print share.url
            assert isinstance(share, Share)
            self.current_user.admin_remove_share_from_group(share, group)
        for user in group.users:
            if str(user.id) != str(self.current_user.id):
                print str(user.id), str(self.current_user.id)
                self.current_user.admin_remove_user_from_group(user, group)
        self.current_user.destroy_group(group)
        self.write(json.dumps({'message': 'success'}))


class GroupInfo(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/info?group_id=:group_id 查询组信息，包括成员
        @apiVersion 0.1.6
        @apiName GetGroupInfo
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id来搜索group信息

        @apiParam {String} group_id the id of group.

        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.
        @apiSuccess {String} group_intro Group.intro
        @apiSuccess {Number} group_share_sum Group.group_share_sum
        @apiSuccess {String} create_time The time of group created.
        @apiSuccess {Object} admin Admin of the group.
        @apiSuccess {String} admin.name The name of admin.
        @apiSuccess {String} admin.id The id of admin.
        @apiSuccess {String} admin.avatar The avatar of admin.
        @apiSuccess {Object[]} users Users in the group.
        @apiSuccess {String} users.name The name of users.
        @apiSuccess {String} users.id The id of users.
        @apiSuccess {String} users.avatar The avatar of users.

        @apiUse GroupNotExistError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_info)

    @BaseHandler.sandbox
    def show_info(self, response):
        self.session = self.get_session()
        group_id = self.get_argument('group_id')
        if not group_id:
            raise BaseException(u'该组不存在')
        group = ShareGroup.objects(id=group_id).first()
        user = User.objects(id=self.session['_id']).first()
        if group and user and user.is_in_the_group(group=group):
            result = dict()
            result['group_name'] = group.name
            result['group_id'] = str(group.id)
            result['group_intro'] = group.intro
            result['group_share_sum'] = len(group.shares)
            result['admin'] = dict()
            result['admin']['name'] = group.create_user.nickname
            result['admin']['id'] = str(group.create_user.id)
            result['admin']['avatar'] = str(group.create_user.avatar)
            result['create_time'] = str(group.create_time)
            result['users'] = [{'name': user.nickname, 'id': str(user.id), 'avatar': user.avatar} for user in group.users]
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure',
                                   'reason': u'该组不存在'}))

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def put(self):
        """
        @api {put} /group/info 修改组介绍
        @apiVersion 0.1.2
        @apiName UpdateGroupIntro
        @apiGroup ShareGroup
        @apiPermission admin


        @apiParam {String} group_id Group.id
        @apiParam {String} intro Group.intro

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse ForbiddenError
        """
        group_id = self.get_body_argument('group_id')
        group = ShareGroup.objects(id=group_id).first()
        if group is None:
            raise BaseException(u'该组不存在')
        if self.current_user.id != group.create_user.id:
            raise tornado.web.HTTPError(403)
        group.intro = self.get_body_argument('intro')
        group.save()
        self.write(json.dumps({'message': 'success'}))


class GroupShare(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/shares?group_id=:group_id 获取组内的share
        @apiVersion 0.1.6
        @apiName GetGroupShare
        @apiGroup ShareGroup
        @apiPermission member

        @apiDescription 根据group_id获取组内share.

        @apiParam {String} group_id The id of group.

        @apiSuccess {Object[]} shares Shares in the group.
        @apiSuccess {String} shares.title The title of shares.
        @apiSuccess {String} shares.intro Introduction("" if not exists).
        @apiSuccess {String} shares.id The id of shares.
        @apiSuccess {String} shares.url The url of shares.
        @apiSuccess {String} shares.share_time Time when share first made.
        @apiSuccess {Number} shares.comment_sum The sum of comments.
        @apiSuccess {String} shares.is_gratitude true|false.
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
                            'intro': '' if not len(share.comments) else share.comments[0].content,
                            'id': str(share.id),
                            'url': share.url,
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
                            'share_time': str(share.share_time),
                            'is_gratitude': share in user.gratitude_shares
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


class FetchAllGroup(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/all 获取用户所在的所有组
        @apiVersion 0.1.4
        @apiName GetAllGroup
        @apiGroup ShareGroup
        @apiPermission login

        @apiSuccess {Object[]} groups
        @apiSuccess {String} group_name The name of group.
        @apiSuccess {String} group_id The id of group.

        @apiSuccessExample {json} Success-Example
            HTTP/1.1 200 OK
            {
                "groups": [
                    {
                        "group_id": group.id,
                        "group_name": group.name,
                        "group_intro": group.intro
                    }
                ]
            }
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.fetch_groups)

    @BaseHandler.sandbox
    def fetch_groups(self, response):
        user = User.objects(id=self.session['_id']).first()
        self.write(json.dumps({
            'groups': [
                {
                    'group_id': str(group.id),
                    'group_name': group.name,
                    'group_intro': group.intro
                } for group in user.groups
            ]
        }))


class ExitGroup(BaseHandler):

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def put(self):
        """
        @api {put} /group/exit 组员退组
        @apiVersion 0.1.5
        @apiName ExitGroup
        @apiGroup ShareGroup
        @apiPermission member


        @apiParam {String} group_id Group.id

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse ForbiddenError
        """
        group = ShareGroup.objects(id=self.get_body_argument('group_id')).first()
        if group is None or not self.current_user.is_in_the_group(group=group):
            raise BaseException(u'该组不存在')
        user = self.current_user

        user.exit_group(group)

        self.write(json.dumps({'message': 'success'}))


class Expel(BaseHandler):

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def put(self):
        """
        @api {delete} /group/expel 踢人出组
        @apiVersion 0.1.5
        @apiName Expel
        @apiGroup ShareGroup
        @apiPermission admin

        @apiParam {String} group_id Group.id
        @apiParam {String} user_id User.id

        @apiUse SuccessMsg

        @apiUse GroupNotExistError
        @apiUse ForbiddenError
        """
        group = ShareGroup.objects(id=self.get_body_argument('group_id')).first()
        user = User.objects(id=self.get_body_argument('user_id')).first()

        # Admin can NOT expel admins
        if group is None or not self.current_user.is_admin(group) or user.is_admin(group):
            raise tornado.web.HTTPError(403)
        # User to be expelled must be a member of group
        if user is None or not user.is_in_the_group(group):
            raise BaseException(u"该组员不存在")

        user.exit_group(group)

        self.write(json.dumps({'message': 'success'}))


class GroupInvite(BaseHandler):

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def get(self):
        """
        @api {get} /group/invite?group_id=:group_id 获取帐号列表
        @apiVersion 0.1.6
        @apiName GetAccountList
        @apiGroup ShareGroup
        @apiPermission admin

        @apiDescription 尽量少调用这个接口， 对数据库和后台的压力不小

        @apiParam {String} group_id 组id.

        @apiSuccess {String} email 邮箱
        @apiSuccess {String} nickname 昵称
        @apiSuccess {String} avatar 头像
        @apiSuccess {Boolean} is_member 是否为组成员
        @apiSuccess {Boolean} is_inviting 是否已发出邀请

        @apiUse NotLoginError
        @apiUse OtherError
        """
        group = ShareGroup.objects(id=self.get_argument('group_id')).first()
        if group is None or not self.current_user.is_admin(group):
            raise tornado.web.HTTPError(403)
        inviting = [inv.invitee_email for inv in Invite.objects(invite_group=group.id).all()]
        applying = [user.email for user in group.apply_users]
        processing_user_emails = inviting + applying
        users = User.objects().all()
        r = [{
            "email": user.email,
            "nickname": user.nickname,
            "avatar": user.avatar,
            "is_member": user in group.users,
            "is_inviting": False if user in group.users else user.email in processing_user_emails
        } for user in users]
        self.write(json.dumps({"accounts": r}))

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /group/invite 邀请加组
        @apiVersion 0.1.6
        @apiName GroupInvite
        @apiGroup ShareGroup
        @apiPermission login

        @apiDescription 邀请用户加组， 如果该用户没有激活， 则发送邮件到他的邮箱（团队邮箱）
        现阶段为了防止大量的垃圾邮件，我把发邮件的功能暂时**封印**了

        @apiParam {String} group_id Id of group.
        @apiParam {String} email Email of user to be invited.

        @apiSuccess {String} message Success.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        inviter_id = self.session['_id']
        invite_group_id = self.get_body_argument('group_id')
        email = self.get_body_argument("email")

        _invite = Invite.objects(Q(inviter=inviter_id)
                                 & Q(invitee_email=email)
                                 & Q(invite_group=invite_group_id)).first()
        if _invite is not None:
            raise BaseException(u'邀请已发出')
        if inviter_id and invite_group_id and email:
            invite_group = ShareGroup.objects(id=invite_group_id).first()
            if invite_group is None:
                raise BaseException(u'该组不存在')
            invite_entity = Invite(inviter=self.current_user,
                                   invitee_email=email,
                                   invite_group=invite_group)
            user = User.objects(email=email).first()
            invite_entity.save()
            if user:
                user._notify_invite(invite_entity, self.current_user)
                if not user.is_activated:
                    pass
                    # client = tornado.httpclient.AsyncHTTPClient()
                    # request_body = urllib.urlencode({"email": email})
                    # client.fetch("http://104.128.81.102:44444/mail", self.check_postman_result, method="POST", body=request_body)
            else:
                raise BaseException(u'该用户不存在')
            self.write(json.dumps({'message': 'success'}))
            self.finish()

    @BaseHandler.sandbox
    def check_postman_result(self, response):
        if response.code == 200:
            self.write(json.dumps({"message": "success"}))
        else:
            self.write(json.dumps({"message": "failed"}))
