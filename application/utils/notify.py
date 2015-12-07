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
                                       FRESH_MEMBER,
                                       REPLY)


class NotifyBaseHandler(object):
    """The base handler for notify handler.

    This base class aims to be derived, so you'd better NOT initiate this class

    notify_type: must be set, it's a flag to determine the notify type
    __init__: derived classes should invoke super()
    output: determine the message format in result of json, derived classes should invoke super()
    check: check the validity of notify
    remove: do clean jobs(do not delete notifies, which would be done afterwards together)
    """

    notify_type = None

    def __init__(self, notify=None, user=None):
        assert self.notify_type
        self.notify = notify
        self.user = user

    def output(self):
        if self.notify is None:
            raise BaseException(u'Illegal notify')

    def check(self):
        """To check the legality of notify.

        Returns True by default, you can override it in derived class
        :return: Boolean
        """
        return True

    def remove(self):
        """Do cleaning job.

        Override it in derived class.
        :return: None
        """
        pass

    @classmethod
    def save(cls, user, content):
        assert cls.notify_type
        assert isinstance(user, User)
        print cls.notify_type, cls
        notify = Notify(notify_id=content.id, notify_user=user.id, notify_type=cls.notify_type)
        notify.save()
        return notify


class NotifyCommentHandler(NotifyBaseHandler):

    notify_type = COMMENT

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._comment = Comment.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        comment = self._comment
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "comment_id": str(comment.id),
            "title": comment.share.title,
            "content": comment.content,
            "user_id": str(comment.user.id),
            "nickname": comment.user.nickname,
            "avatar": comment.user.avatar
        }

    def check(self):
        return self._comment is not None


class NotifyShareHandler(NotifyBaseHandler):

    notify_type = SHARE

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._share = Share.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        share = self._share
        if share is None:
            raise BaseException(u'Illegal share notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "share_id": str(share.id),
            "title": share.title,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }

    def check(self):
        return self._share is not None


class NotifyFollowHandler(NotifyBaseHandler):

    notify_type = FOLLOW

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._user = User.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        user = self._user
        if user is None:
            raise BaseException(u'Illegal follow notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "user_id": str(user.id),
            "nickname": user.nickname,
            "avatar": user.avatar
        }

    def check(self):
        return self._user is not None


class NotifyGratitudeHandler(NotifyBaseHandler):

    notify_type = GRATITUDE

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._share = Share.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        share = Share.objects(id=self.notify.notify_id).first()
        if share is None:
            raise BaseException(u'Illegal gratitude notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "title": share.title,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }

    def check(self):
        return self._share is not None


class NotifyAdminHandler(NotifyBaseHandler):

    notify_type = ADMIN

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._group = ShareGroup.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        group = self._group
        if group is None:
            raise BaseException(u'Illegal gratitude notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "group_id": str(group.id),
            "group_name": group.name,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }

    def check(self):
        return self._group is not None


class NotifyInviteHandler(NotifyBaseHandler):

    notify_type = INVITE

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._invite = Invite.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        invite = self._invite
        assert invite
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "key": str(self.notify.notify_id),
            "group_id": str(invite.invite_group.id),
            "group_name": invite.invite_group.name,
            "user_id": str(self.notify.notify_user.id),
            "nickname": self.notify.notify_user.nickname,
            "avatar": self.notify.notify_user.avatar
        }

    def check(self):
        if self._invite is None:
            raise BaseException(u'Illegal invite notify')
        group = ShareGroup.objects(id=self._invite.invite_group.id).first()
        return group is not None

    def remove(self):
        if self._invite:
            self._invite.delete()


class NotifyFreshMemberHandler(NotifyBaseHandler):

    notify_type = FRESH_MEMBER

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._fresh_member_group = ShareGroup.objects(id=self.notify.notify_id).first()
        self._fresh_member_user = User.objects(id=self.notify.notify_user.id).first()

    def output(self):
        super(self.__class__, self).output()
        group = self._fresh_member_group
        user = self._fresh_member_user
        if not group or not user:
            print self.notify.id
            raise BaseException(u'Illegal fresh member notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "group_id": str(group.id),
            "group_name": group.name,
            "user_id": str(user.id),
            "nickname": user.nickname,
            "avatar": user.avatar,
        }

    def check(self):
        return self._fresh_member_group and self._fresh_member_user

    def remove(self):
        self.user.notify_content.remove(self.notify)
        self.notify.delete()


class NotifyReplyHandler(NotifyBaseHandler):

    notify_type = REPLY

    def __init__(self, notify=None, user=None):
        super(self.__class__, self).__init__(notify, user)
        self._reply = Comment.objects(id=self.notify.notify_id).first()

    def output(self):
        super(self.__class__, self).output()
        reply = self._reply
        if reply is None:
            raise BaseException(u'Illegal reply notify')
        return {
            "id": str(self.notify.id),
            "notify_type": self.notify_type,
            "time": str(self.notify.notify_time),
            "reply_id": str(reply.id),
            "title": reply.share.title,
            "content": reply.content,
            "user_id": str(reply.user.id),
            "nickname": reply.user.nickname,
            "avatar": reply.user.avatar
        }

    def check(self):
        return self._reply is not None


class NotifyItem(object):

    route_map = {
        COMMENT: NotifyCommentHandler,
        SHARE: NotifyShareHandler,
        FOLLOW: NotifyFollowHandler,
        GRATITUDE: NotifyGratitudeHandler,
        ADMIN: NotifyAdminHandler,
        INVITE: NotifyInviteHandler,
        FRESH_MEMBER: NotifyFreshMemberHandler,
        REPLY: NotifyReplyHandler
    }

    def __init__(self, notify, user):
        assert isinstance(notify, Notify)
        assert isinstance(user, User)
        self.notify = notify
        self.user = user
        self.handler = None

    def get_handler(self):
        if self.notify.notify_type not in self.route_map:
            raise NotImplementedError
        if self.handler is None:
            self.handler = self.route_map[self.notify.notify_type](self.notify, self.user)
        return self.handler

    def load_notify(self):
        # if self.notify.notify_type not in self.route_map:
        #     raise NotImplementedError
        # _handler = self.route_map[self.notify.notify_type](self.notify)
        # return _handler.output()
        return self.get_handler().output()

    def check(self):
        return self.get_handler().check()

    def remove(self):
        return self.get_handler().remove()

    def read_notify(self, user_id):
        user = User.objects(id=user_id).first()
        if not user or self.notify not in user.notify_content:
            print 'fail to read notify', self.notify, user.notify_content
            return False
        print 'read', self.notify, type(self.notify)
        self.notify.read = True
        self.notify.save()
        return True
