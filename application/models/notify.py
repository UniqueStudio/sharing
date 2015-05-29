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

class Notify(Document):
    """
        存储推送信息
    """
    notify_id = ObjectIdField(required=True)    #收到推送通知内容的_id
    notify_user = ReferenceField('User', required=True)    #需要通知的用户
    notify_type = StringField(required=True)
    notify_time = DateTimeField(required=True, default=datetime.datetime.now())
    notify_content = StringField(required=True)  #推送内容，如换的管理员名称，感谢数

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
        self.notify_content = '%s 回复了你的 %s share' \
                              % (comment_user.nickname, comment.share.title)
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
        self.notify_content = '%s 分享了 %s' \
                                % (share_user.nickname, share.title)
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
        self.notify_content = '%s 关注了你' % (follow_user.nickname)
        self.save()

    def notify_gratitude(self, user, gratitude_user, share):
        self.notify_id = share.id
        self.notify_type = GRATITUDE
        self.notify_user = user
        self.notify_content = '%s 感谢了你的share %s' \
                                % (gratitude_user.nickname, share.title)
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
        self.notify_content = '%s 组的管理员已经由%s更换为%s' \
                                % (group.name, old_admin.nickname, group.create_user)
        self.save()