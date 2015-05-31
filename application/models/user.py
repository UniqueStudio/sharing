# encoding:utf-8
__author__ = 'bing'

from mongoengine import Document
from mongoengine.fields import *
import md5
from mongoengine import connect
from mongoengine.queryset import CASCADE

import datetime

from application.exception import BaseException


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

    self_shares = ListField(ReferenceField('Share'), default=list)
    self_inbox_shares = ListField(ReferenceField('InboxShare'), default=list)
    gratitude_shares = ListField(ReferenceField('Share'), default=list)

    comments = ListField(ReferenceField('Comment'), default=list)
    black_users = ListField(ReferenceField('self'), default=list)
    following = ListField(ReferenceField('self'), default=list)
    followers = ListField(ReferenceField('self'), default=list)

    groups = ListField(ReferenceField('ShareGroup'), default=list)

    manager_groups = ListField(ReferenceField('ShareGroup'), default=list)


    notify_content = ListField(ReferenceField('Notify'), default=list)

    def __init__(self, email, nickname=None, *args, **kwargs):
        super(User, self).__init__(email=email,
                                   nickname=nickname, *args, **kwargs)

    def set_password(self, password):
        """
        加密设置密码
        :param password:
        :return:
        """
        self.password = md5.new(password).hexdigest()
        return self.password

    def check_password(self, password):
        return self.set_password(password) == self.password

    def __str__(self):
        return '<User: \nnickname:%s, \nemail:%s>' % (self.nickname, self.email)

    @classmethod
    def is_exist(cls, email):
        return cls.objects(email=email).first() is not None

    #组部分
    def is_in_the_group(self, group):
        return group in self.groups

    def _add_the_group(self, group):
        self.groups.append(group)
        self.save()

    def remove_the_group(self, group):  #退组,管理员另处理
        from application.models import ShareGroup
        if not group.is_create_user(self):
            if self.is_in_the_group(group) and ShareGroup.is_exist(group.name):
                self.groups.remove(group)
                group.users.remove(self)
                self.save()
        else:
            print '暂时不处理组创建人退组行为'

    #感谢部分
    def is_gratitude(self, share):
        return share in self.gratitude_shares

    def gratitude(self, share):  #感谢分享到group的share(每个share都有独立的分组)
        if self.is_share(share=share, group=share.own_group):
            print '不能感谢自己'
            return
        if not self.is_gratitude(share):
            share._gratitude(self)
            self.gratitude_shares.append(share)
            self.save()
            #为该share的所有分享者都传递感谢
            for share_user in share.share_users:
                share_user._notify_gratitude(gratitude_user=self, share=share)
        else:
            print '重复感谢'

    #个人分享部分
    def is_share(self, share, group):  #是否分享到某个组
        return share in self.self_shares and share.own_group == group

    def share_to_group(self, share, group, comment_content=None):  #将share分享到group中
        from application.models import Share
        if not self.is_share(share, group) \
                and self.is_in_the_group(group) \
                and share not in self.self_shares:
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, own_group=group).first()
                share._add_share_user(self)
            else:
                print 'add share'
                share._add_share(self, group)
            if comment_content:
                self.add_comment_to_share(share, comment_content)
            self.self_shares.append(share)
            self.save()
            #为自己的关注者说明已share了
            for follower in self.followers:
                follower._notify_share(share_user=self, share=share)
        else:
            print '已分享或不是该组成员'
            from mongoengine import ValidationError
            try:
                share.delete()
            except ValidationError:
                pass

    def remove_share_to_group(self, share, group):  #从group删除自己分享了的share
        from application.models import Share
        if self.is_share(share, group) and self.is_in_the_group(group):
            if Share.is_exist(share.url, group):
                share = Share.objects(url=share.url, own_group=group).first()
                if len(share.share_users) == 1:  #该条share只有一个分享者直接删除
                    share._share_delete()
                    self.self_shares.remove(share)
                    group._remove_share(share)
                    self.save()
                else:
                    if self in share.share_users:
                        share._remove_share_user()
                        self.self_shares.remove(share)
                        self.save()
                    else:
                        raise Share.ShareException('并没有分享过')
            else:
                raise Share.ShareException('该share不存在')

    #inbox部分
    def is_in_inbox(self, inbox_share):
        return inbox_share in self.self_inbox_shares and inbox_share.own_user == self

    def add_inbox_share(self, inbox_share):
        from application.models import InboxShare
        if not self.is_in_inbox(inbox_share):
            self.self_inbox_shares.append(inbox_share)
            inbox_share._add_inbox(user=self)
            self.save()
        else:
            raise InboxShare.InboxShareException('inbox中该share已存在')

    def remove_inbox_share(self, inbox_share):
        from application.models import InboxShare
        if self.is_in_inbox(inbox_share):
            self.self_inbox_shares.remove(inbox_share)
            inbox_share._delete_from_inbox()
            self.save()
        else:
            raise InboxShare.InboxShareException('inbox中该share并不存在')

    def send_share(self, inbox_share, group):  #将inbox_share投递入具体组
        from application.models import Share, InboxShare
        if self.is_in_inbox(inbox_share) and InboxShare.is_exist(inbox_share.url, self):
            share = Share(title=inbox_share.title, url=inbox_share.url)
            share.save()
            self.share_to_group(share=share, group=group)
            self.remove_inbox_share(inbox_share=inbox_share)
        else:
            raise InboxShare.InboxShareException('inbox中该share并不存在')

    #添加评论部分
    def add_comment_to_share(self, share, comment_content):
        """
            向某个share(每个group的share在数据库表现是独立的)添加comment
            :param comment_content:添加的评论内容
        """
        from application.models import Comment
        comment = Comment(user=self, content=comment_content, share=share).save()
        share._add_comment(comment)
        self.comments.append(comment)
        #向share的share_users中每一个推送
        for share_user in share.share_users:
            share_user._notify_comment(self, comment)
        self.save()

    def remove_comment_to_share(self, comment_id):
        """
            向某个share(每个group的share在数据库表现是独立的)删除comment
            :param comment_id:删除评论的id
        """
        from application.models import Comment
        comment = Comment.objects(id=comment_id).first()
        if comment in self.comments:    #只能删除自己的
            comment.share._remove_comment(comment)  #comment的删除在里面操作了
        else:
            print '只能删除自己的'

    #关注拉黑部分
    def follow(self, user):
        """
        self对user关注
        :param user: 被关注者
        """
        if user.id == self.id:
            return
        if User.is_exist(user.email) and user not in self.following\
                and self not in user.followers:
            self.cancel_black(user)
            self.following.append(user)
            user.followers.append(self)
            self.save()
            user.save()
            #添加通知
            user._notify_follow(self)

    def black(self, user):
        if user.id == self.id:
            return
        if User.is_exist(user.email) and user not in self.black_users:
            self.cancel_follow(user)
            self.black_users.append(user)
            self.save()

    def cancel_follow(self, user):
        if user.id == self.id:
            return
        if User.is_exist(user.email) and user in self.following\
                 and self in user.followers:
            self.following.remove(user)
            user.followers.remove(self)
            self.save()
            user.save()

    def cancel_black(self, user):
        if user.id == self.id:
            return
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

    def set_avatar(self, avatar_path):
        self.avatar = avatar_path
        self.save()

    #通知方法
    def _notify_comment(self, comment_user, comment):
        """
        向self用户的推送内容增加comment推送
        :param comment_user: 评论用户
        :param comment: 评论
        """
        from application.models import Notify
        notify = Notify()
        notify.notify_comment(user=self, comment_user=comment_user, comment=comment)
        #推送的键应该是被评论的share.id,当自己一条share被多次评论的时候可以合并一条
        self.notify_content.append(notify)
        self.save()

    def _notify_share(self, share_user, share):
        """
        向self用户的推送内容增加share推送
        :param share_user: share的用户
        :param share:
        """
        from application.models import Notify
        notify = Notify()
        notify.notify_share(user=self, share_user=share_user, share=share)
        #推送的键应该是share.id，以便当多个关注者分享一个share时候合并作为一条显示
        self.notify_content.append(notify)
        self.save()

    def _notify_follow(self, follow_user):
        """
        向self用户的推送内容增加关注推送，提示follow_user关注了self
        :param follow_user: 关注者
        """
        from application.models import Notify
        notify = Notify()
        notify.notify_follow(user=self, follow_user=follow_user)
        self.notify_content.append(notify)
        self.save()

    def _notify_gratitude(self, gratitude_user, share):
        """
        向self用户的推送内容增加感谢share（自己分享的）的推送
        :param gratitude_user: 感谢的用户
        :param share: 被感谢的share
        """
        from application.models import Notify
        notify = Notify()
        notify.notify_gratitude(user=self, gratitude_user=gratitude_user, share=share)
        self.notify_content.append(notify)
        self.save()

    def notify_change_admin(self, old_admin, group):
        """
        向self用户的推送内容增加group改变组管理员的推送
        :param old_admin: 以前的管理员
        :param group: 所在组
        """
        from application.models import Notify
        notify = Notify()
        notify.notify_change_admin(user=self, old_admin=old_admin, group=group)
        self.notify_content.append(notify)
        self.save()


    #管理员方法
    def is_admin(self, group):
        """
            是否是group的管理员
        """
        return group in self.manager_groups and group.is_create_user(self)

    def admin_remove_user_from_group(self, user, group):
        """
            从group中删除user
        """
        if self.is_admin(group) and not user.is_admin(group):  #管理员不能删除管理员
            user.remove_the_group(group)
            group._remove_user(user=user)

    def admin_remove_share_from_group(self, share, group):
        """
            删除group中分享的share
        """
        from application.models import Share
        if self.is_admin(group) and Share.is_exist(share.url, group):
            share._share_delete()

    def admin_remove_comment_to_share(self, share, comment_id):
        from application.models import Comment
        if self.is_admin(group=share.own_group):
            comment = Comment.objects(id=comment_id).first()
            share._remove_comment(comment)  #comment的删除在里面操作了


    def admin_allow_user_entry(self, user, group):
        """
            使user加入group
            :param user:该user应该是在传进来之前被验证过且在数据库中的
        """
        if not user.is_in_the_group(group=group) and self.is_admin(group):
            user._add_the_group(group=group)
            group._add_user(user)
        else:
            print '没有成功加入，或许是权限不够或许是user已经在组内', user.is_in_the_group(group=group)

    #异常部分
    class UserException(BaseException):
        pass
