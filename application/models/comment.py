# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *
import md5
from mongoengine import connect
from mongoengine.queryset import CASCADE

import datetime

from application.exception import BaseException


class Comment(Document):
    user = ReferenceField('User', required=True)
    content = StringField(required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)
    share = ReferenceField('Share')

    def __str__(self):
        return '<comment: \nuser:%s, \nshare:%s, \ncontent:%s>' \
                    % (self.user, self.share, self.content)

    @classmethod
    def is_exist(cls, id):
        return Comment.objects(id=id).first() is not None

    def _comment_delete(self):
        self.delete()
