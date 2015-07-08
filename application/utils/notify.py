# encoding:utf-8

from application.models import Notify
from application.exception import BaseException
from application.models import Comment, Share, User, ShareGroup, Invite
from application.models.notify import (COMMENT,
                                       SHARE,
                                       FOLLOW,
                                       GRATITUDE,
                                       ADMIN,
                                       INVITE,
                                       FRESH_MEMBER)


class NotifyBaseHandler(object):

    notify_type = None

    def __init__(self, notify=None):
        assert self.notify_type
        self.notify = notify

    def output(self):
        if self.notify is None:
            raise BaseException(u'Illegal notify')

    @classmethod
    def save(cls, user, content):
        assert cls.notify_type
        assert isinstance(user, User)
        notify = Notify(notify_id=content.id, notify_user=user.id, notify_type=cls.notify_type)
        notify.save()
        return notify


class NotifyCommentHandler(NotifyBaseHandler):

    notify_type = COMMENT

    def output(self):
        super(self.__class__, self).output()
        comment = Comment.objects(id=self.notify.notify_id).first()
        if comment is None:
            raise BaseException(u'Illegal comment notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "comment_id": str(comment.id),
            "title": comment.share.title,
            "content": comment.content,
            "user_id": str(comment.user.id),
            "nickname": comment.user.nickname,
            "avatar": comment.user.avatar
        }


class NotifyShareHandler(NotifyBaseHandler):

    notify_type = SHARE

    def output(self):
        super(self.__class__, self).output()
        share = Share.objects(id=self.notify.notify_id).first()
        if share is None:
            raise BaseException(u'Illegal share notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "share_id": str(share.id),
            "title": share.title,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }


class NotifyFollowHandler(NotifyBaseHandler):

    notify_type = FOLLOW

    def output(self):
        super(self.__class__, self).output()
        user = User.objects(id=self.notify.notify_id).first()
        if user is None:
            raise BaseException(u'Illegal follow notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "user_id": str(user.id),
            "nickname": user.nickname,
            "avatar": user.avatar
        }


class NotifyGratitudeHandler(NotifyBaseHandler):

    notify_type = GRATITUDE

    def output(self):
        super(self.__class__, self).output()
        share = Share.objects(id=self.notify.notify_id).first()
        if share is None:
            raise BaseException(u'Illegal gratitude notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "title": share.title,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }


class NotifyAdminHandler(NotifyBaseHandler):

    notify_type = ADMIN

    def output(self):
        super(self.__class__, self).output()
        group = ShareGroup.objects(id=self.notify.notify_id).first()
        if group is None:
            raise BaseException(u'Illegal gratitude notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "group_id": str(group.id),
            "group_name": group.name,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }


class NotifyInviteHandler(NotifyBaseHandler):

    notify_type = INVITE

    def output(self):
        super(self.__class__, self).output()
        invite = Invite.objects(id=self.notify.notify_id).first()
        if invite is None:
            raise BaseException(u'Illegal invite notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "key": str(self.notify.notify_id),
            "group_id": str(invite.invite_group.id),
            "group_name": invite.invite_group.name,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }


class NotifyFreshMemberHandler(NotifyBaseHandler):

    notify_type = FRESH_MEMBER

    def output(self):
        super(self.__class__, self).output()
        group = ShareGroup.objects(id=self.notify.notify_id).first()
        user = User.objects(id=self.notify.notify_user.id).first()
        if not group or not user:
            raise BaseException(u'Illegal fresh member notify')
        return {
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "group_id": str(group.id),
            "group_name": group.name,
            "user_id": str(user.id),
            "nickname": user.nickname,
            "avatar": user.avatar,
        }


class NotifyItem(object):

    route_map = {
        COMMENT: NotifyCommentHandler,
        SHARE: NotifyShareHandler,
        FOLLOW: NotifyFollowHandler,
        GRATITUDE: NotifyGratitudeHandler,
        ADMIN: NotifyAdminHandler,
        INVITE: NotifyInviteHandler,
        FRESH_MEMBER: NotifyFreshMemberHandler
    }

    def __init__(self, notify):
        assert isinstance(notify, Notify)
        self.notify = notify

    def load_notify(self):
        if self.notify.notify_type not in self.route_map:
            raise NotImplementedError
        _handler = self.route_map[self.notify.notify_type](self.notify)
        return _handler.output()
