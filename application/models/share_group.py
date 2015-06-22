# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *

import datetime

from application.exception import BaseException


class ShareGroup(Document):

    name = StringField(required=True, unique=True)
    create_user = ReferenceField('User', required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)

    shares = ListField(ReferenceField('Share'))
    users = ListField(ReferenceField('User'), default=list)
    # advance_users = ListField(ReferenceField('User'), default=list)

    apply_users = ListField(ReferenceField('User'), default=list)

    def __str__(self):
        return '<Group: \nname:%s, \ncreate_user:%s>' \
               % (self.name, self.create_user)

    @classmethod
    def is_exist(cls, name):
        groups = cls.objects(name=name).first()
        return groups is not None

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

    def change_admin(self, user):
        self.create_user = user
        self.save()

    def add_apply_user(self, user):
        if not user.is_in_the_group(group=self):
            if user in self.apply_users:
                raise ShareGroup.GroupException('已申请')
            self.apply_users.append(user)
            self.save()
        else:
            raise ShareGroup.GroupException('成员已在组中')

    def accept_apply(self, user):
        if user in self.apply_users:
            self.create_user.admin_allow_user_entry(user=user, group=self)
            self.apply_users.remove(user)
            self.save()
        else:
            raise ShareGroup.GroupException('该用户没有申请')

    def reject_apply(self, user):
        if user in self.apply_users:
            self.apply_users.remove(user)
            self.save()
        else:
            raise ShareGroup.GroupException('该用户没有申请')


    class GroupException(BaseException):
        pass