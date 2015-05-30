# encoding:utf-8

from mongoengine import Document
from mongoengine.fields import *

import datetime

from application.exception import BaseException
from application.models import Share, InboxShare, Comment, ShareGroup

import sys

reload(sys)
sys.setdefaultencoding('utf8')

COMMENT = 'COMMENT'
SHARE = 'SHARE'
FOLLOW = 'FOLLOW'
GRATITUDE = 'GRATITUDE'
ADMIN = 'ADMIN'
INVITE = 'INVITE'

class Notify(Document):
    """
        存储推送信息
    """
    notify_id = ObjectIdField(required=True)    #收到推送通知内容的_id
    notify_user = ReferenceField('User', required=True)    #需要通知的用户
    notify_type = StringField(required=True)
    notify_time = DateTimeField(required=True, default=datetime.datetime.now())

    def notify_comment(self, user, comment_user, comment):
        """
            推送comment_user给user的share评论或回复
            :param user:被通知用户
            :param comment_user:评论/回复者
            :param comment: 评论
        """
        self.notify_id = comment.id
        self.notify_type = COMMENT
        self.notify_user = user
        self.save()

    def notify_share(self, user, share_user, share):
        """
            关注的人分享一个share通知
            :param user:被通知用户
            :param share_user:分享share的用户(因为可以多个人分享一个share，所以必须指定)
            :param share:被创建的share
        """
        self.notify_id = share.id
        self.notify_type = SHARE
        self.notify_user = user
        self.save()

    def notify_follow(self, user, follow_user):
        """
            有人特别关注了user
            :param user:被关注者
            :param follow_user:关注者
        """
        self.notify_id = follow_user.id
        self.notify_type = FOLLOW
        self.notify_user = user
        self.save()

    def notify_gratitude(self, user, gratitude_user, share):
        self.notify_id = share.id
        self.notify_type = GRATITUDE
        self.notify_user = user
        self.save()

    def notify_change_admin(self, user, old_admin, group):
        """
            更换管理员
            :param user:通知的user
            :param old_admin:以前的管理员
            :param group:跟换管理员的组
        """
        self.notify_id = group.id
        self.notify_type = ADMIN
        self.notify_user = user
        self.save()

    def notify_invite(self, user, invite):
        """
        已注册用户受到某个要求，邀请内容在invite中
        :param user: 受邀请的用户
        :param invite: 邀请
        """
        self.notify_id = invite.id
        self.notify_type = INVITE
        self.notify_user = user
        self.save()