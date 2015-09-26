# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *

import datetime


class Comment(Document):
    to_user = ReferenceField('User')
    user = ReferenceField('User', required=True)
    content = StringField(required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)
    share = ReferenceField('Share', required=True)

    def __str__(self):
        return '<comment: \nuser:%s, \nshare:%s, \ncontent:%s>' \
                    % (self.user, self.share, self.content)

    @classmethod
    def is_exist(cls, id):
        return Comment.objects(id=id).first() is not None

    def _comment_delete(self):
        print "delete comment"
        print self.user.comments
        self.user.comments.remove(self)
        self.user.save()
        print self.user.comments
        self.delete()
