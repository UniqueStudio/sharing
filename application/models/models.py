#encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *

import datetime

class Comment(Document):
    user = ReferenceField('User', required=True)
    content = StringField(required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)
    share = ReferenceField('Share')

class Share(Document):
    title = StringField(required=True)
    explain = StringField(required=True)
    url = URLField(required=True, unique=True)
    own_group = ListField(ReferenceField('ShareGroup'), default=[])
    share_users = ListField(ReferenceField('User'), default=[])
    share_time = DateTimeField(required=True, default=datetime.datetime.now)
    gratitude_num = IntField(required=True, default=0)

    gratitude_users = ListField(ReferenceField('User'), default=[])
    comments = ListField(ReferenceField(Comment))


class ShareGroup(Document):
    name = StringField(required=True, unique=True)
    create_user = ReferenceField('User', required=True)
    administrators = ListField(ReferenceField('User'), required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)

    shares = ListField(ReferenceField(Share))
    users = ListField(ReferenceField('User'), default=[])


class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    nickname = StringField(required=True, unique=True)
    register_time = DateTimeField(required=True, default=datetime.datetime.now())
    avatar = StringField(required=True, default='have no')

    phone_number = StringField()
    is_man = BooleanField(null=True)
    education_information = StringField()
    brief = StringField()
    inviter = ReferenceField('self')
    self_shares = ListField(ReferenceField(Share), default=[])
    gratitude_shares = ListField(ReferenceField(Share), default=[])
    comments = ListField(ReferenceField(Comment), default=[])
    black_users = ListField(ReferenceField('self'), default=[])
    attention_users = ListField(ReferenceField('self'), default=[])
    groups = ListField(ReferenceField(ShareGroup), default=[])
    manager_groups = ListField(ReferenceField(ShareGroup), default=[])

    @classmethod
    def is_exist(cls, email):
        users = cls.objects(email=email)
        return users.count() > 0

    def is_in_the_group(self, group):
        return group in self.groups

    def add_the_group(self, group):
        if not self.is_in_the_group(group):
            self.groups.append(group)

if __name__ == '__main__':
    from mongoengine import connect
    conn = connect('share')

    # #测试user存储
    # user1 = User(email='498283580@qq.com', password='123456', nickname='user1').save()
    # user2 = User(email='498283581@qq.com', password='123456', nickname='user2').save()
    # user3 = User(email='498283582@qq.com', password='123456', nickname='user3').save()
    #
    # #测试group存储，并指定创建者和管理员
    # group = ShareGroup(name='test', create_user=user1, administrators=[user1]).save()
    # user1.manager_groups.append(group)
    # #为group添加user
    # group.users.append(user1)
    # group.users.append(user2)
    # user1.groups.append(group)
    # #测试添加share
    # share = Share(title='test', explain='test', url='http://www.baidu.com').save()
    # group.shares.append(share)
    # share.own_group.append(group)
    # share.share_users.append(user1)
    # user1.self_shares.append(share)
    # #测试share加评论，comment的user和share指定
    # comment = Comment(user=user1, content='test', share=share).save()
    # share.comments.append(comment)
    # user1.comments.append(comment)
    # #测试user黑名单
    # user1.black_users.append(user2)
    # #测试user特别关注
    # user1.attention_users.append(user3)
    # #测试添加邀请人
    # user3.inviter = user1
    # #测试感谢share
    # share.gratitude_num += 1
    # user1.gratitude_shares.append(share)
    # share.gratitude_users.append(user1)
    #
    # user1.save()
    # user2.save()
    # user3.save()
    # group.save()
    # share.save()
    # comment.save()

    user = User.objects(email='498283580@qq.com').first()
    group = ShareGroup.objects(name='test').first()
    print user.is_in_the_share_group(group)
