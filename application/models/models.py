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
    is_delete = BooleanField(required=True, default=False)  #删除标记

    @classmethod
    def is_exist(cls, id):
        return Comment.objects(id=id).first() is not None

    def comment_delete(self):
        self.is_delete = True
        self.save()

class Share(Document):
    """
        区分是否是同一个share的方法是判断url和own_group是否相等
    """
    title = StringField(required=True)
    explain = StringField(required=True)
    url = URLField(required=True)
    own_group = ReferenceField('ShareGroup')
    share_users = ListField(ReferenceField('User'), default=list) #单个组分析用户
    share_time = DateTimeField(required=True, default=datetime.datetime.now)
    gratitude_num = IntField(required=True, default=0)

    gratitude_users = ListField(ReferenceField('User'), default=list)
    comments = ListField(ReferenceField(Comment))

    @classmethod
    def is_exist(cls, url, group):    #是否在group中存在url的share
        return Share.objects(url=url, own_group=group).first() is not None

    def gratitude(self, user):
        self.gratitude_num += 1
        self.gratitude_users.append(user)
        self.save()

    def add_share(self, user, group):
        if not Share.is_exist(self.url, group):
            self.share_users.append(user)
            self.own_group = group
            self.save()

    def remove_share_user(self, user, group):   #删除分享的用户
        if Share.is_exist(self.url, group):
            self.share_users.remove(user)
            self.save()

class ShareGroup(Document):
    name = StringField(required=True, unique=True)
    create_user = ReferenceField('User', required=True)
    administrators = ListField(ReferenceField('User'), required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)

    shares = ListField(ReferenceField(Share))
    users = ListField(ReferenceField('User'), default=list)

    @classmethod
    def is_exist(cls, name):
        groups = cls.objects(name=name).first()
        return groups != None

    def is_admin(self, user):
        return user in self.administrators

    def add_user(self, user):   #用户加入group中，逻辑上应该是group做的事
        if User.is_exist(user.email) and not user.is_in_the_group(self) \
                and ShareGroup.is_exist(self.name):
            user.groups.append(self)
            self.users.append(user)
            self.save()
            user.save()

    def remove(self, user):
        """
            这个方法仅是从group删除用户，具体是管理员删除或是用户自行退组不管
        """
        self.users.remove(user)
        self.save()

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    nickname = StringField(required=True)
    register_time = DateTimeField(required=True, default=datetime.datetime.now())
    avatar = StringField(required=True, default='have no')

    phone_number = StringField()
    is_man = BooleanField(null=True)
    education_information = StringField()
    brief = StringField()
    inviter = ReferenceField('self')

    self_shares = ListField(ReferenceField(Share), default=list)
    gratitude_shares = ListField(ReferenceField(Share), default=list)

    comments = ListField(ReferenceField(Comment), default=list)
    black_users = ListField(ReferenceField('self'), default=list)
    attention_users = ListField(ReferenceField('self'), default=list)

    groups = ListField(ReferenceField(ShareGroup), default=list)

    manager_groups = ListField(ReferenceField(ShareGroup), default=list)


    def __str__(self):
        return '<User :%s\n email:%s>' % (self.nickname, self.email)

    @classmethod
    def is_exist(cls, email):
        users = cls.objects(email=email)
        return users.count() > 0

    #组部分
    def is_in_the_group(self, group):
        return group in self.groups

    def remove_the_group(self, group):  #退组,与管理员身份无关
        if self.is_in_the_group(group)and ShareGroup.is_exist(group.name):
            self.groups.remove(group)
            group.users.remove(self)
            #如果是管理员也删除
            if self in group.administrators:
                group.administrators.remove(self)
                group.save()
            self.save()

    #感谢部分
    def is_gratitude(self, share):
        return share in self.gratitude_shares

    def gratitude(self, share):     #感谢分享到group的share(每个share都有独立的分组)
        share.gratitude(self)
        self.gratitude_shares.append(share)
        self.save()

    #个人分享部分
    def is_share(self, share, group):   #是否分享到某个组
        return share in self.self_shares and share.own_group == group

    def share_to_group(self, share, group):     #将share分享到group中
        if not self.is_share(share, group):
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, group=group).first()
            share.share_users.append(self)
            share.save()
            self.self_shares.append(share)
            self.save()
        else:
            print '已分享'


    def remove_share_to_group(self, share, group):  #从group删除分享了的share
        if self.is_share(share, group):
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, group=group).first()
                if len(share.share_users) == 1: #该条share只有一个分享者直接删除
                    share.delete()
                    self.self_shares.remove(share)
                    self.save()
                else:
                    if self in share.share_users:
                        share.share_users.remove(self)
                        share.save()
                        self.self_shares.remove(share)
                        self.save()
                    else:
                        print '并没有分享过'
            else:
                print '该share不存在'

    #添加评论部分
    def add_comment_to_share(self, share, comment_content):
        """
            向某个share(每个group的share在数据库表现是独立的)添加comment
            :param comment_content:添加的评论内容
        """
        comment = Comment(user=self, content=comment_content, share=share).save()
        share.comments.append(comment)
        share.save()
        self.comments.append(comment)
        self.save()

    def remove_comment_to_share(self, share, comment_id):
        """
            向某个share(每个group的share在数据库表现是独立的)删除comment
            :param comment_id:删除评论的id
        """
        comment = Comment.objects(id=comment_id).first()
        share.comments.remove(comment)
        share.save()
        self.comments.remove(comment)
        self.save()
        comment.comment_delete()

    #关注拉黑部分
    def add_attention(self, user):
        if User.is_exist(user.mail) and user not in self.attention_users:
            self.remove_block(user)
            self.attention_users.append(user)

    def block(self, user):
        if User.is_exist(user.mail) and user not in self.black_users:
            self.remove_attention(user)
            self.black_users.append(user)

    def remove_attention(self, user):
        if User.is_exist(user.mail) and user in self.attention_users:
            self.attention_users.remove(user)

    def remove_block(self, user):
        if User.is_exist(user.mail) and user in self.black_users:
            self.black_users.remove(user)

    #修改个人信息部分, 修改个人信息在一个请求中调用
    def modify_information(self, is_man, brief, education_information, phone_number):
        self.is_man = is_man
        self.brief = brief
        self.education_information = education_information
        self.phone_number = phone_number
        self.save()

    #以下均为管理员方法，具体是否整理为单独一个类后行考虑
    def is_admin(self, group):
        """
            是否是group的管理员
        """
        pass

    def remove_user_from_group(self, user, group):
        """
            从group中删除user
        """
        pass

    def remove_share_from_group(self, share, group):
        """
            删除该用户在group中分享的share
        """
        pass

    def add_user(self, user, group):
        """
            使user加入group
        """
        pass

if __name__ == '__main__':
    print 'Test script to be finished'
    from mongoengine import connect
    conn = connect('share')

    # #测试user存储
    # user1 = User(email='test0@qq.com', password='123456', nickname='user1').save()
    # user2 = User(email='test1@qq.com', password='123456', nickname='user2').save()
    # user3 = User(email='test2@qq.com', password='123456', nickname='user3').save()
    
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
    # share.own_group=group
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
    
    # user1.save()
    # user2.save()
    # user3.save()
    # group.save()
    # share.save()
    # comment.save()

    # user = User.objects(email='test1@qq.com').first()
    # share = Share.objects(title='test').first()
    # group = ShareGroup.objects(name='test').first()
    # print Share.is_exist('http://www.baidu.com', group)
    # comment = Comment.objects(user=user).first()
    # assert comment is None
    # print user.is_in_the_group(group)
    # print user.is_gratitude(share)

    # print ShareGroup.is_exist('tet')


    # user = User.objects(email='498283580@qq.com').first()
    # comment = Comment.objects(id='552a0d15421aa930e8ad0111').first()
    # print comment.content
