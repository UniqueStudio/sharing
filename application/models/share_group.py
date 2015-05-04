# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *
import md5
from mongoengine import connect
from mongoengine.queryset import CASCADE

import datetime

from application.exception import BaseException


class ShareGroup(Document):

    name = StringField(required=True, unique=True)
    create_user = ReferenceField('User', required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)

    shares = ListField(ReferenceField('Share'))
    users = ListField(ReferenceField('User'), default=list)

    def __str__(self):
        return '<Group: \nname:%s, \ncreate_user:%s>' \
               % (self.name, self.create_user)

    @classmethod
    def is_exist(cls, name):
        groups = cls.objects(name=name).first()
        return groups != None

    def is_admin(self, user):
        return user == self.create_user

    def _add_user(self, user):  #用户加入group中，逻辑上应该是group做的事
        from application.models import Share, User
        if User.is_exist(user.email) and ShareGroup.is_exist(self.name):
            self.users.append(user)
            self.save()

    def _remove_user(self, user):
        """
            这个方法仅是从group删除用户，具体是管理员删除或是用户自行退组不管
        """
        self.users.remove(user)
        self.save()

    def _add_share(self, share):
        self.shares.append(share)
        self.save()

    def _remove_share(self, share):
        """
        删除已经分享了的share
        :param share:
        :return:
        """
        self.shares.remove(share)
        self.save()

    def is_create_user(self, user):
        return self.create_user == user

