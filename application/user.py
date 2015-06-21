#encoding:utf-8

import tornado.web
import tornado.httpclient
from mongoengine import Q
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite
from application.exception import BaseException

import json
import os
import time
import hashlib

class Login(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        """
        @api {post} /login Login
        @apiVersion 0.1.0
        @apiName Login
        @apiGroup User

        @apiDescription 使用邮箱密码登录.

        @apiParam {String} email Email as account.
        @apiParam {String} password Password.

        @apiUse MessageSuccess

        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.login)

    @BaseHandler.sandbox
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
            self.write(json.dumps({'message': 'success'}))

class Register(BaseHandler):

    @tornado.web.asynchronous
    def post(self, invite_id=None):
        """
        @api {post} /register 注册(测试用)
        @apiVersion 0.1.0
        @apiName RegisterTest
        @apiGroup User

        @apiDescription 直接使用邮箱密码注册share账户.

        @apiParam {String} email Email as account.
        @apiParam {String} nickname Nickname as account.
        @apiParam {String} password Password.

        @apiUse MessageSuccess

        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        self.invite_id = invite_id
        client.fetch(request=self.request, callback=self.register)

    @BaseHandler.sandbox
    def register(self, response):
        """
        @api {post} /register/:key 注册并加入组
        @apiVersion 0.1.0
        @apiName Register
        @apiGroup User

        @apiDescription 通过key来注册share，key在邀请的链接中.
        注册完成后用户将自动成为待进组的状态，接下来只需该组管理员的审核.

        @apiParam {String} key Key of invite.
        @apiParam {String} email Email as account.
        @apiParam {String} nickname Nickname as account.
        @apiParam {String} password Password.

        @apiUse MessageSuccess

        @apiUse OtherError
        """
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        nickname = self.get_body_argument('nickname')
        if User.is_exist(email):
            raise User.UserException('Email已经被占用')
        invite = None
        if self.invite_id:
            invite = Invite.objects(id=self.invite_id).first()
            email = invite.invitee_email
        user = User(email=email, nickname=nickname)
        user.set_password(password=password)
        user.save()
        if invite:
            group = invite.invite_group
            group.add_apply_user(user)
            user.inviter = invite.inviter
            user.save()
            invite.invite_delete()
        self.recode_status_login(user)
        self.write(json.dumps({'message': 'success'}))

class Homepage(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        """
        @api {post} /homepage[?uid=:uid] Homepage
        @apiVersion 0.1.0
        @apiName Homepage
        @apiGroup User
        @apiPermission login

        @apiDescription 查看个人主页内容，包括分享的share.
        如果加上可选的uid，则可以看到这个uid对应用户的信息，
        其同组的share可见，否则不可见.
        带optional的返回字段仅自己可见.

        @apiParam {String} [uid] User id.

        @apiSuccess {String} nickname Nickname of user.
        @apiSuccess {String} id Id of user.
        @apiSuccess {String} avatar Avatar of user.
        @apiSuccess {Boolean} is_man Gender of user.
        @apiSuccess {String} brief Self description of user.
        @apiSuccess {String} register_time Register time of user.
        @apiSuccess {Object[]} groups Groups of user.
        @apiSuccess {String} groups.id Id of groups.
        @apiSuccess {String} groups.name Name of groups.
        @apiSuccess {Object[]} shares Shares of user.
        @apiSuccess {String} shares.id Id of shares.
        @apiSuccess {String} shares.title Title of shares.
        @apiSuccess {String} shares.group Group of shares.
        @apiSuccess {String} shares.share_time Time shared.
        @apiSuccess {String} [gratitude_shares_sum] The sum of gratitude received.
        @apiSuccess {String} [comment_sum] The sum of comments made before.
        @apiSuccess {String} [black_users_sum] The sum of user in blacklist.
        @apiSuccess {String} [followers_sum] The sum of followers.
        @apiSuccess {String} [following_sum] The sum of following.

        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_homepage)

    @tornado.web.authenticated
    @BaseHandler.sandbox
    def get_homepage(self, response):
        self.session = self.get_session()
        uid_arugument = self.get_body_argument('uid', default=None)
        uid = self.session['_id']
        query_uid = uid if uid_arugument is None else uid_arugument
        user = User.objects(id=query_uid).first()
        result = {}
        result['nickname'] = user.nickname
        result['id'] = str(user.id)
        result['avatar'] = user.avatar
        result['is_man'] = user.is_man
        result['brief'] = user.brief
        result['register_time'] = str(user.register_time)
        result['groups'] = [
            {
                'id': str(group.id),
                'name': group.name
            }
            for group in user.groups]
        if uid_arugument is None:
            result['gratitude_shares_sum'] = len(user.gratitude_shares)
            result['comments_sum'] = len(user.comments)
            result['black_users_sum'] = len(user.black_users)
            result['followers_sum'] = len(user.followers)
            result['following_sum'] = len(user.following)
            result['shares'] = [
                {
                    'id': str(share.id),
                    'title': share.title,
                    'group': share.own_group.name,
                    'share_time': str(share.share_time)
                }
                for share in user.self_shares]
            result['manager_groups'] = [
                {
                    'id': str(group.id),
                    'name': group.name
                }for group in user.manager_groups]
        else:
            mine = User.objects(id=uid).first()
            result['shares'] = [
                {
                    'id': str(share.id),
                    'title': share.title,
                    'group': share.own_group.name,
                    'share_time': str(share.share_time)
                }
                for share in user.self_shares if share.own_group in mine.groups]
        self.write(json.dumps(result))


class MyInformation(BaseHandler):

    @tornado.web.asynchronous
    def get(self):
        """
        @api {get} /setting Personal setting
        @apiVersion 0.1.0
        @apiName GetMyInformation
        @apiGroup User
        @apiPermission login

        @apiDescription 查询个人信息，仅对自己有效.

        @apiSuccess {String} nickname Nickname of user.
        @apiSuccess {String} email Email of user.
        @apiSuccess {String} id Id of user.
        @apiSuccess {String} avatar Avatar of user.
        @apiSuccess {Boolean} is_man Gender of user.
        @apiSuccess {String} brief Self description of user.
        @apiSuccess {String} education_information Education information of user.
        @apiSuccess {String} [phone_number] Phone number of user.

        @apiUse NotLoginError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_information)

    @tornado.web.authenticated
    @BaseHandler.sandbox
    def get_information(self, response):
        self.session = self.get_session()
        user = User.objects(id=self.session['_id']).first()
        print type(user.education_information)
        self.write(json.dumps({
            'nickname': user.nickname,
            'email': user.email,
            'id': str(user.id),
            'avatar': user.avatar,
            'is_man': user.is_man,
            'brief': user.brief,
            'education_information': user.education_information,
            'phone_number': user.phone_number
        }))

    @tornado.web.asynchronous
    def post(self):
        """
        @api {post} /setting Update personal info.
        @apiVersion 0.1.0
        @apiName PostMyInformation
        @apiGroup User
        @apiPermission login

        @apiDescription 修改个人信息.

        @apiParam {Number} [is_man=0,1] Gender of user.
        @apiParam {String} brief Self description of user.
        @apiParam {String} education_information Education information of user.
        @apiParam {String} [phone_number] Phone number of user.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.modify_information)

    @tornado.web.authenticated
    @BaseHandler.sandbox
    def modify_information(self, response):
        phone_number = self.get_body_argument('phone_number', default=None)
        is_man = self.get_body_argument('is_man', default=1) != '0'
        education_information = self.get_body_argument('education_information')
        brief = self.get_body_argument('brief')
        id = self.session['_id']
        user = User.objects(id=id).first()
        user.modify_information(is_man=is_man, brief=brief,
                                education_information=education_information,
                                phone_number=phone_number)
        self.write(json.dumps({'message': 'success'}))


class UploadImage(BaseHandler):

    def get(self):
        self.write(
            """
<html>
  <head><title>Upload File</title></head>
  <body>
    <form action='upload_image' enctype="multipart/form-data" method='post'>
    <input type='file' name='avatar'/><br/>
    <input type='submit' value='submit'/>
    </form>
  </body>
</html>
            """
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
                self.write(json.dumps({'message': 'success'}))
            else:
                self.write(json.dumps({'message': '无文件'}))
        else:
            self.write(json.dumps({'message': '未登陆'}))

    def save_file(self, file, save_dir, user):
        file_name = file['filename'] + str(time.time())
        file_name = hashlib.md5(file_name).hexdigest()
        save_file_name = os.path.join(save_dir, file_name)
        #TODO:对图片进行压缩处理
        with open(save_file_name, 'wb') as up:
            up.write(file['body'])
        user.set_avatar(save_file_name)
        self.finish()


class InviteByEmail(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        """
        @api {post} /user/invite 邀请注册.
        @apiVersion 0.1.0
        @apiName InviteByEmail
        @apiGroup User
        @apiPermission login

        @apiDescription 通过邮件的形式邀请注册.

        @apiParam {String} group_id Id of group.
        @apiParam {String} email Email of user to be invited.

        @apiUse NotLoginError
        @apiUse OtherError
        """
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.invite)

    @tornado.web.authenticated
    @BaseHandler.sandbox
    def invite(self, response):
        self.session = self.get_session()
        inviter_id = self.session['_id']
        invite_group_id = self.get_body_argument('group_id')
        email = self.get_body_argument("email")
        _invite = Invite.objects(Q(inviter=inviter_id)
                                 & Q(invitee_email=email)
                                 & Q(invite_group=invite_group_id)).first()
        if _invite is not None:
            raise BaseException(u'邀请已发出')
        if inviter_id and invite_group_id and email:
            inviter = User.objects(id=inviter_id).first()
            invite_group = ShareGroup.objects(id=invite_group_id).first()
            if invite_group is None:
                raise BaseException(u'该组不存在')
            invite_entity = Invite(inviter=inviter,
                                   invitee_email=email,
                                   invite_group=invite_group)
            invite_entity.save()
            #TODO:send email
            info = str(invite_entity.id)
            print info
            self.write({'message': 'success'})


class AcceptInvite(BaseHandler):

    @tornado.web.asynchronous
    def get(self, invite_id):
        """
        @api {get} /user/accept/:key 接受邀请
        @apiVersion 0.1.0
        @apiName AcceptInvite
        @apiGroup User

        @apiDescription 通过key来接受邀请，key默认在邀请链接中.
        用户应当已是share注册用户，这样才能使用这个接口接受邀请.

        @apiParam {String} key Key of invite.

        @apiUse MessageSuccess

        @apiUse OtherError
        """
        self.invite_id = invite_id
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.accept_invite)

    @tornado.web.authenticated
    @BaseHandler.sandbox
    def accept_invite(self, response):
        self.session = self.get_session()
        invite = Invite.objects(id=self.invite_id).first()
        if not invite:
            raise BaseException(u'邀请码错误')
        user = User.objects(id=self.session['_id']).first()
        group = invite.invite_group
        group.add_apply_user(user)
        user.inviter = invite.inviter
        user.save()
        invite.invite_delete()
        self.write(json.dumps({'message': 'success'}))


class Follow(BaseHandler):

    @tornado.web.asynchronous
    def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_follow)

    def get_follow(self, response):
        pass

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.follow)

    def follow(self, response):
        followed_user_id = self.get_body_argument('followed_user_id')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            followed_user = User.objects(id=followed_user_id).first()
            user.follow(followed_user)
            self.write(json.dumps({'message', 'success'}))
        else:
            self.write(json.dumps({'message', 'failure'}))
        self.finish()


class Black(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.black)

    def black(self, response):
        blacked_user_id = self.get_body_argument('blacked_user_id')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            blacked_user = User.objects(id=blacked_user_id).first()
            user.black(blacked_user)
            self.write(json.dumps({'message', 'success'}))
        else:
            self.write(json.dumps({'message', 'failure'}))
        self.finish()


class CancelFollow(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.cancel_follow)

    def cancel_follow(self, response):
        cancelled_user_id = self.get_body_argument('cancelled_user_id')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            cancelled_user = User.objects(id=cancelled_user_id).first()
            user.cancel_follow(cancelled_user)
            self.write(json.dumps({'message', 'success'}))
        else:
            self.write(json.dumps({'message', 'failure'}))
        self.finish()


class CancelBlack(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.cancel_black)

    def cancel_black(self, response):
        cancelled_user_id = self.get_body_argument('cancelled_user_id')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            cancelled_user = User.objects(id=cancelled_user_id).first()
            user.cancel_black(cancelled_user)
            self.write(json.dumps({'message', 'success'}))
        else:
            self.write(json.dumps({'message', 'failure'}))
        self.finish()


class ApplyGroup(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.apply_group)

    def apply_group(self, response):
        group_name = self.get_body_argument('name')
        self.session = self.get_session()
        user_id = self.session['_id']
        user = User.objects(id=user_id).first()
        group = ShareGroup.objects(name=group_name).first()
        try:
            group.add_apply_user(user)
            self.write(json.dumps({'message': 'success'}))
        except ShareGroup.GroupException:
            self.write(json.dumps({'message': 'failure'}))
        self.finish()
