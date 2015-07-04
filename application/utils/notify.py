# encoding:utf-8

from application.models import Notify


class NofityItem(object):

    def __init__(self, notify):
        assert isinstance(notify, NotifyBase)
        self.notify = notify

    def load_notify(self):
        return self.notify.output()


class NotifyBase(object):

    notify_type = None

    def __init__(self, n_id, n_uid):
        assert self.notify_type
        _notify = Notify(notify_id=n_id, notity_user=n_uid, notify_type=self.notify_type)
        _notify.save()

    def output(self):
        raise NotImplementedError


class NotifyComment(NotifyBase):

    notify_type = 'COMMENT'

    def output(self):
        pass
