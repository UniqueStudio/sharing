# coding=utf8

from mongoengine import Document
from mongoengine import fields


class Dairy(Document):
    user_id = fields.ReferenceField("User", required=True)
    create_time = fields.IntField(required=True)
    contents = fields.ListField(fields.ReferenceField("Share"), default=list)
