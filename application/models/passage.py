# encoding:utf-8
from mongoengine import Document
from mongoengine.fields import *

import datetime


class Passage(Document):

    url = URLField(required=True)
    last_updated = DateTimeField(required=True, default=datetime.datetime.now)
    html = StringField(required=True)
    ref = IntField(required=True, default=1)

    def decrease_ref(self):
        if self.ref > 1:
            self.ref -= 1
            self.save()
        else:
            self.delete()
