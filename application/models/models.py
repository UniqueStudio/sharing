# encoding:utf-8
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

    def __str__(self):
        return '<comment: \nuser:%s, \nshare:%s, \ncontent:%s, \ncomment_is_delete:%s>' \
                    % (self.user, self.share, self.content, self.is_delete)

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
    share_users = ListField(ReferenceField('User'), default=list)  #单个组分析用户
    share_time = DateTimeField(required=True, default=datetime.datetime.now)
    gratitude_num = IntField(required=True, default=0)

    gratitude_users = ListField(ReferenceField('User'), default=list)
    comments = ListField(ReferenceField(Comment))

    is_delete = BooleanField(required=True, default=False)

    def __str__(self):
        return '<Share: \nurl:%s \nown_group:%s \nshare_is_delete:%s>' \
                    % (self.url, self.own_group, self.is_delete)

    @classmethod
    def is_exist(cls, url, group):  #是否在group中存在url的share
        return Share.objects(url=url, own_group=group, is_delete=False).first() is not None

    def gratitude(self, user):
        self.gratitude_num += 1
        self.gratitude_users.append(user)
        self.save()

    def add_share(self, user, group):
        if not Share.is_exist(self.url, group):
            self.share_users.append(user)
            self.own_group = group
            self.save()

    def add_share_user(self, user):  #添加分享用户
        self.share_users.append(user)
        self.save()

    def remove_share_user(self, user):  #删除分享用户
        self.share_users.remove(user)
        self.save()

    def share_delete(self):
        self.is_delete = True
        self.save()

    def remove_share_user(self, user, group):  #删除分享的用户
        if Share.is_exist(self.url, group):
            self.share_users.remove(user)
            self.save()

    def add_comment(self, comment):  #添加评论
        self.comments.append(comment)
        self.save()

    def remove_comment(self, comment):  #删除评论,形式上的删除
        comment.comment_delete()


class ShareGroup(Document):
    name = StringField(required=True, unique=True)
    create_user = ReferenceField('User', required=True)
    administrators = ListField(ReferenceField('User'), required=True)
    create_time = DateTimeField(required=True, default=datetime.datetime.now)

    shares = ListField(ReferenceField(Share))
    users = ListField(ReferenceField('User'), default=list)

    def __str__(self):
        return '<Group: \nname:%s, \ncreate_user:%s, \nadministrators:%s>' \
               % (self.name, self.create_user, self.administrators)

    @classmethod
    def is_exist(cls, name):
        groups = cls.objects(name=name).first()
        return groups != None

    def is_admin(self, user):
        return user in self.administrators

    def add_user(self, user):  #用户加入group中，逻辑上应该是group做的事
        if User.is_exist(user.email) and ShareGroup.is_exist(self.name):
            self.users.append(user)
            self.save()

    def remove_user(self, user):
        """
            这个方法仅是从group删除用户，具体是管理员删除或是用户自行退组不管
        """
        self.users.remove(user)
        self.save()

    def remove_share(self, share):
        """
        删除已经分享了的share
        :param share:
        :return:
        """
        self.shares.remove(share)
        self.save()

    def remove_administrators(self, user):
        """
        删除管理员
        :param user:管理员
        :return:
        """
        if user in self.administrators:
            self.administrators.remove(user)
            self.save()

    def is_create_user(self, user):
        return self.create_user == user


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
        return '<User: \nnickname:%s, \nemail:%s>' % (self.nickname, self.email)

    @classmethod
    def is_exist(cls, email):
        users = cls.objects(email=email)
        return users.count() > 0

    #组部分
    def is_in_the_group(self, group):
        return group in self.groups

    def add_the_group(self, group):
        self.groups.append(group)
        self.save()

    def remove_the_group(self, group):  #退组,与管理员身份无关
        if not group.is_create_user(self):
            if self.is_in_the_group(group) and ShareGroup.is_exist(group.name):
                self.groups.remove(group)
                group.users.remove(self)
                #如果是管理员也删除
                if self.is_admin(group):
                    group.remove_administrators(user=self)
                    self.manager_groups.remove(group)
                self.save()
        else:
            print '暂时不处理组创建人退组行为'

    #感谢部分
    def is_gratitude(self, share):
        return share in self.gratitude_shares

    def gratitude(self, share):  #感谢分享到group的share(每个share都有独立的分组)
        if not self.is_gratitude(share):
            share.gratitude(self)
            self.gratitude_shares.append(share)
            self.save()
        else:
            print '重复感谢'

    #个人分享部分
    def is_share(self, share, group):  #是否分享到某个组
        return share in self.self_shares and share.own_group == group

    def share_to_group(self, share, group):  #将share分享到group中
        if not self.is_share(share, group):
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, group=group).first()
                share.add_share_user()
            else:
                share.add_share(self, group)
            self.self_shares.append(share)
            self.save()
        else:
            print '已分享'


    def remove_share_to_group(self, share, group):  #从group删除自己分享了的share
        if self.is_share(share, group):
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, group=group).first()
                if len(share.share_users) == 1:  #该条share只有一个分享者直接删除
                    share.share_delete()
                    self.self_shares.remove(share)
                    self.save()
                else:
                    if self in share.share_users:
                        share.remove_share_user()
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
        share.add_comment(comment)
        self.comments.append(comment)
        self.save()

    def remove_comment_to_share(self, share, comment_id):
        """
            向某个share(每个group的share在数据库表现是独立的)删除comment,只是形式上的删除
            :param comment_id:删除评论的id
        """
        comment = Comment.objects(id=comment_id).first()
        if comment in self.comments:    #只能删除自己的
            share.remove_comment(comment)  #comment的删除在里面操作了
        else:
            print '只能删除自己的'

    #关注拉黑部分
    def add_attention(self, user):
        if User.is_exist(user.email) and user not in self.attention_users:
            self.remove_black(user)
            self.attention_users.append(user)
            self.save()

    def black(self, user):
        if User.is_exist(user.email) and user not in self.black_users:
            self.remove_attention(user)
            self.black_users.append(user)
            self.save()

    def remove_attention(self, user):
        if User.is_exist(user.email) and user in self.attention_users:
            self.attention_users.remove(user)
            self.save()

    def remove_black(self, user):
        if User.is_exist(user.email) and user in self.black_users:
            self.black_users.remove(user)
            self.save()
        else:
            print '用户不存在或用户不在黑名单中'

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
        return group in self.manager_groups and self in group.administrators

    def admin_remove_user_from_group(self, user, group):
        """
            从group中删除user
        """
        if self.is_admin(group) and not user.is_admin(group):  #管理员不能删除管理员
            user.remove_the_group(group)
            group.remove_user(user=user)

    def admin_remove_share_from_group(self, share, group):
        """
            删除group中分享的share
        """
        if self.is_admin(group) and Share.is_exist(share.url, group):
            share.share_delete()

    def admin_remove_comment_to_share(self, share, comment_id):
        if self.is_admin(group=share.own_group):
            comment = Comment.objects(id=comment_id).first()
            share.remove_comment(comment)  #comment的删除在里面操作了


    def admin_allow_user_entry(self, user, group):
        """
            使user加入group
            :param user:该user应该是在传进来之前被验证过且在数据库中的
        """
        if not user.is_in_the_group(group=group) and self.is_admin(group):
            user.add_the_group(group=group)
            group.add_user(user)
        else:
            print '没有成功加入，或许是权限不够或许是user已经在组内'


if __name__ == '__main__':
    print 'Test script to be finished'
    from mongoengine import connect

    conn = connect('share')

    # #测试创建User
    # user1 = User(email='test0@qq.com', password='123456', nickname='user1').save()
    # user2 = User(email='test1@qq.com', password='123456', nickname='user2').save()
    # user3 = User(email='test2@qq.com', password='123456', nickname='user3').save()
    #
    # #测试group存储，并指定创建者和管理员
    # group = ShareGroup(name='test', create_user=user1, users=[user1], administrators=[user1]).save()
    # user1.manager_groups.append(group)
    #
    # #为group添加user
    # user1.allow_user_entry(user=user2, group=group)
    #
    # #测试添加share
    # share = Share(title='test', explain='test', url='http://www.baidu.com').save()
    # user1.share_to_group(share=share, group=group)
    #
    # #测试share加评论，comment的user和share指定
    # user1.add_comment_to_share(share=share, comment_content='test')



    #得到测试的user1，user2, share, group
    # admin = User.objects(email='test0@qq.com').first()
    # user = User.objects(email='test1@qq.com').first()
    # group = ShareGroup.objects(name='test').first()
    # share = Share.objects(url='http://www.baidu.com').first()
    # print admin.nickname, user.nickname
    # print group.name
    # print share.url
    # print admin.is_admin(group)

    #测试感谢
    # print share.gratitude_num, share.gratitude_users
    # user.gratitude(share)
    # print share.gratitude_num, share.gratitude_users

    # #测试退组,管理员也可以退，但是应该保留最少一个，或者是说保留创建人，创建人退了等于解散组,这儿并没有完成
    # print group.users
    # user.remove_the_group(group)
    # print user.groups

    # #管理员加人
    # admin.admin_allow_user_entry(user=user, group=group)

    #管理员删人
    # print group.users
    # admin.admin_remove_user_from_group(user, group)
    # print group.users


    #测试user黑名单
    # admin.black(user)
    # print admin.black_users
    # admin.remove_black(user)
    # print admin.black_users
    #测试user特别关注
    # admin.add_attention(user)
    # print admin.attention_users
    # admin.remove_attention(user)
    # print admin.attention_users

    #删除评论
    # comments = Comment.objects()
    # print comments
    # admin.remove_comment_to_share(share=share, comment_id=comments[0].id)
    # print comments

    #测试不能删除他人评论
    # comments = Comment.objects()
    # user.add_comment_to_share(share=share, comment_content='tests')
    #管理员不受限制
    # comments = Comment.objects()
    # print comments[1]
    # admin.admin_remove_comment_to_share(share=share, comment_id=comments[1].id)
    # print comments[1]
