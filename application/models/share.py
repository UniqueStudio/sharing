# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import *
from mongoengine.queryset.base import CASCADE
import md5

import datetime

from application.exception import BaseException


class GratitudeEmbedded(EmbeddedDocument):
    g_from = ReferenceField('User')  # 投递感谢的人
    g_to = ReferenceField('User')    # 被感谢的人


class Share(Document):
    """
        区分是否是同一个share的方法是判断url和own_group是否相等
    """
    title = StringField(required=True)
    url = URLField(required=True)
    own_group = ReferenceField('ShareGroup')
    share_users = ListField(ReferenceField('User'), default=list)  #单个组分析
    share_time = DateTimeField(required=True, default=datetime.datetime.now)

    # gratitude_users = ListField(ReferenceField('User'), default=list)
    gratitude_users = ListField(EmbeddedDocumentField('GratitudeEmbedded'), default=list)
    comments = ListField(ReferenceField('Comment'))
    passage = ReferenceField('Passage', reverse_delete_rule=CASCADE)

    def __str__(self):
        return '<Share: \nurl:%s \nown_group:%s \n>' \
                    % (self.url, self.own_group)

    @classmethod
    def is_exist(cls, url, group):  #是否在group中存在url的share
        return Share.objects(url=url, own_group=group).first() is not None

    def _gratitude(self, user):
        gratitude = GratitudeEmbedded()
        gratitude.g_from = user
        gratitude.g_to = self.share_users[0]
        self.gratitude_users.append(gratitude)
        self.share_users[0].gratitude_count += 1
        self.share_users[0].save()
        self.save()

    def _cancel_gratitude(self, user):
        for x in self.gratitude_users:
            if x.g_from.id == user.id:
                x.g_to.gratitude_count -= 1
                x.g_to.save()
                self.gratitude_users.remove(x)
                break
        self.save()

    def add_share_user(self, user):  #添加分享用户
        if user not in self.share_users:
            self.share_users.append(user)
            self.save()

    def _share_delete(self):
        for comment in self.comments:
            comment._comment_delete()
        self.delete()

    def add_comment(self, comment):  #添加评论
        self.comments.append(comment)
        self.save()

    def _remove_comment(self, comment):  #删除评论,形式上的删除
        self.comments.remove(comment)
        self.save()
        comment._comment_delete()

    class ShareException(BaseException):
        pass

