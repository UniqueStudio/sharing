# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *
import md5
from mongoengine import connect
from mongoengine.queryset import CASCADE

import datetime

from application.exception import BaseException


class Share(Document):
    """
        区分是否是同一个share的方法是判断url和own_group是否相等
    """
    title = StringField(required=True)
    url = URLField(required=True)
    own_group = ReferenceField('ShareGroup')
    share_users = ListField(ReferenceField('User'), default=list)  #单个组分析用户
    share_time = DateTimeField(required=True, default=datetime.datetime.now)
    gratitude_num = IntField(required=True, default=0)

    gratitude_users = ListField(ReferenceField('User'), default=list)
    comments = ListField(ReferenceField('Comment', reverse_delete_rule=CASCADE))

    def __str__(self):
        return '<Share: \nurl:%s \nown_group:%s \n>' \
                    % (self.url, self.own_group)

    @classmethod
    def is_exist(cls, url, group):  #是否在group中存在url的share
        return Share.objects(url=url, own_group=group).first() is not None


    def _gratitude(self, user):
        self.gratitude_num += 1
        self.gratitude_users.append(user)
        self.save()

    def _add_share(self, user, group):
        if not Share.is_exist(self.url, group):
            self.share_users.append(user)
            self.own_group = group
            self.save()
            group._add_share(self)

    def _add_share_user(self, user):  #添加分享用户
        if user not in self.share_users:
            self.share_users.append(user)
            self.save()
        else:
            raise Share.ShareException('user已存在')

    def _share_delete(self):
        self.delete()

    def _remove_share_user(self, user, group):  #删除分享的用户
        if Share.is_exist(self.url, group):
            self.share_users.remove(user)
            self.save()

    def _add_comment(self, comment):  #添加评论
        self.comments.append(comment)
        self.save()

    def _remove_comment(self, comment):  #删除评论,形式上的删除
        comment._comment_delete()

    class ShareException(BaseException):
        pass

