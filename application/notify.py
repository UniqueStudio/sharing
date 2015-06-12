#encoding:utf-8

import tornado.web
import tornado.httpclient
from application.base import BaseHandler
from application.models import User, Share, ShareGroup, Comment, Invite
from application.models.notify import COMMENT, SHARE, FOLLOW, GRATITUDE, ADMIN

import json

class NotifyInfo(BaseHandler):

    @tornado.web.asynchronous
    def post(self):
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch(request=self.request, callback=self.notify)

    def show_notify_info(self, response):
        """
            获取通知并对通知进行处理
        """
        #TODO:重构
        self.session = self.get_session()
        user_id = self.session['_id']
        if user_id:
            user = User.objects(id=user_id).first()
            result = dict()
            for notify in user.notify_content:
                if notify.notify_type == COMMENT:
                    result[COMMENT] = dict()
                    comment = Comment.objects(id=notify.notify_id).first()
                    #以share为键方便同一条share有多条comment通知
                    key = str(comment.share.id)
                    if key not in result[COMMENT]:
                        result[COMMENT][key] = list()
                    result[COMMENT][key].append(str(notify.id))
                elif notify.notify_type == SHARE:
                    result[SHARE] = dict()
                    #以share的id作为通知的键，一条share一条通知
                    key = str(notify.notify_id)
                    if key not in result[SHARE]:
                        result[SHARE][key] = list()
                    result[SHARE][key].append(str(notify.id))
                elif notify.notify_type == FOLLOW:
                    result[FOLLOW] = dict()
                    #以登陆用户（被关注的人）的id作为通知的键
                    key = str(user_id)
                    if key not in result[FOLLOW]:
                        result[FOLLOW][key] = list()
                    result[FOLLOW][key].append(str(notify.id))
                elif notify.notify_type == GRATITUDE:
                    result[GRATITUDE] = dict()
                    #以share的id作为键，一条share多条感谢作为一个通知
                    key = str(notify.notify_id)
                    if key not in result[GRATITUDE]:
                        result[GRATITUDE][key] = list()
                    result[GRATITUDE][key].append(str(notify.id))
                elif notify.notify_type == ADMIN:
                    result[ADMIN] = dict()
                    #以group的id作为键
                    key = str(notify.notify_id)
                    if key not in result[ADMIN]:
                        result[ADMIN][key] = list()
                    result[ADMIN][key].append(str(notify.id))
            user.notify_content = list()
            user.save()
            self.write(json.dumps(result))
        else:
            self.write(json.dumps({'message': 'failure', 'reason': '用户未登陆'}))
        self.finish()