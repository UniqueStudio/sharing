#encoding:utf-8

from application.base import BaseHandler
from application.models import User, Share, ShareGroup

import tornado.web
import json

class CreateGroup(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        print 1
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.create_group)

    def create_group(self, response):
        name = self.get_body_argument('name')
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            create_user = User.objects(id=user_id).first()
            self.local_create_group(group_name=name, create_user=create_user)
        else:
            self.write(json.dumps({'message':'failure',
                                   'reason':'user is not login'}))
        self.finish()

    def local_create_group(self, create_user, group_name):
        if not ShareGroup.is_exist(group_name):
            group = ShareGroup(name=group_name, create_user=create_user)
            group.save()
            create_user.manager_groups.append(group)
            create_user.save()
            create_user.admin_allow_user_entry(create_user, group)
            return json.dumps({'message':'success'})
        else:
            return json.dumps({'message':'failure',
                               'reason':'the group name is existent'})

class GroupInfo(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.show_info)

    def show_info(self, response):
        group_id = self.get_body_argument('group_id')
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
        self.finish()

class GroupShare(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_shares)

    def get_shares(self, response):
        group_id = self.get_body_argument('group_id')
        if group_id:
            group = ShareGroup.objects(id=group_id).first()
            if group:
                shares = group.shares
                result = [{share.title: str(share.id)} for share in shares]
                self.write(json.dumps(result))
        self.finish()


class GroupUser(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.get_user)

    def get_user(self, response):
        group_id = self.get_body_argument('group_id')
        if group_id:
            group = ShareGroup.objects(id=group_id).first()
            if group:
                users = group.users
                result = [{user.nickname: str(user.id)} for user in users]
                self.write(json.dumps(result))
        self.finish()


class ChangeAdmin(BaseHandler):
    pass
