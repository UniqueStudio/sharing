# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *
import md5
from mongoengine import connect
from mongoengine.queryset import CASCADE

import datetime

from application.exception import BaseException

class InboxShare(Document):
    """
        inbox中存放的share
    """
    title = StringField(required=True)
    url = URLField(required=True)
    own_user = ReferenceField('User')
    send_time = DateTimeField(required=True, default=datetime.datetime.now)
    InboxShareException = BaseException

    def __str__(self):
        return '<Share: \nurl:%s \nuser:%s \n>' \
                    % (self.url, self.own_user)

    @classmethod
    def is_exist(cls, url, own_user):
        return cls.objects(url=url, own_user=own_user).first() is not None

    def _add_inbox(self, user):
        if not InboxShare.is_exist(self.url, user):
            self.own_user = user
            self.save()
        else:
            print InboxShare.is_exist(self.url, user)
            raise InboxShare.InboxShareException('share已经在inbox存在')

    def _delete_from_inbox(self, ):
        if InboxShare.is_exist(self.url, self.own_user):
            self.delete()
        else:
            raise InboxShare.InboxShareException('share已经在inbox被删除')
