#encoding:utf-8

from mongoengine import Document
from mongoengine.fields import *

import datetime

class Invite(Document):
    inviter = ReferenceField('User', required=True)
    invitee = ReferenceField('User')
    invitee_email = EmailField()
    invite_time = DateTimeField(required=True, default=datetime.datetime.now)
    invite_group = ReferenceField('ShareGroup', required=True)

    def invite_delete(self):
        self.delete()
