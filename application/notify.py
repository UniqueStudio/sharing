#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite
from application.models.notify import COMMENT, SHARE, FOLLOW, GRATITUDE, ADMIN

import datetime
import json

class Notify(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.notify)

    def notify(self, response):
        """
            获取通知并对通知进行处理
        """
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            result = dict()
            for notify in user.notify_content:
                print notify.notify_type
                if notify.notify_type == COMMENT:
                    result[COMMENT] = dict()
                    comment = Comment.objects(id=notify.notify_id).first()
                    key = str(comment.share.id)
                    if key not in result[COMMENT]:
                        result[COMMENT][key] = list()
                    result[COMMENT][key].append(str(notify.id))
                elif notify.notify_type == SHARE:
                    result[SHARE] = dict()
                    key = str(notify.notify_id)
                    if key not in result[SHARE]:
                        result[SHARE][key] = list()
                    result[SHARE][key].append(str(notify.id))
                elif notify.notify_type == FOLLOW:
                    result[FOLLOW] = dict()
                    key = str(user_id)
                    if key not in result[FOLLOW]:
                        result[FOLLOW][key] = list()
                    result[FOLLOW][key].append(str(notify.id))
                elif notify.notify_type == GRATITUDE:
                    result[GRATITUDE] = dict()
                    key = str(notify.notify_id)
                    if key not in result[GRATITUDE]:
                        result[GRATITUDE][key] = list()
                    result[GRATITUDE][key].append(str(notify.id))
                elif notify.notify_type == ADMIN:
                    result[ADMIN] = dict()
                    key = str(notify.notify_id)
                    if key not in result[ADMIN]:
                        result[ADMIN][key] = list()
                    result[ADMIN][key].append(str(notify.id))
            user.notify_content = list()
            user.save()
            self.write(json.dumps(result))
        self.finish()