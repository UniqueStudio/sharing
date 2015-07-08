# encoding:utf-8

from mongoengine import Document
from mongoengine.fields import *

import datetime

import sys

reload(sys)
sys.setdefaultencoding('utf8')

COMMENT = 'COMMENT'
SHARE = 'SHARE'
FOLLOW = 'FOLLOW'
GRATITUDE = 'GRATITUDE'
ADMIN = 'ADMIN'
INVITE = 'INVITE'
FRESH_MEMBER = 'FRESH_MEMBER'

class Notify(Document):
    """
        存储推送信息
    """
    notify_id = ObjectIdField(required=True)    #收到推送通知内容的_id
    notify_user = ReferenceField('User', required=True)    #需要通知的用户
    notify_type = StringField(required=True)
    notify_time = DateTimeField(required=True, default=datetime.datetime.now())
