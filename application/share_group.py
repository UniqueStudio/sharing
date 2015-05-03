#encoding:utf-8

from application.base import BaseHandler
from application.models import User, Share, ShareGroup

import tornado.web
import json

class OperateGroup(BaseHandler):

    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        operate = self.get_body_argument('operate')
        client = tornado.httpclient.AsyncHTTPClient()

        if operate == 'create':
            client.fetch(request=self.request, callback=self.create_group)

    def create_group(self, response):
        name = self.get_body_argument('name')
        if self.session:
            id = self.session['_id']
            create_user = User.objects(id=id).first()
            if not ShareGroup.is_exist(name):
                group = ShareGroup(name=name, create_user=create_user)
                group.save()
                create_user.manager_groups.append(group)
                create_user.save()
                create_user.admin_allow_user_entry(create_user, group)
                self.write(json.dumps({'message':'success'}))
            else:
                self.write(json.dumps({'message':'failure',
                                   'reason':'the group name is existent'}))
        else:
            self.write(json.dumps({'message':'failure',
                                   'reason':'user is not login'}))
        self.finish()
