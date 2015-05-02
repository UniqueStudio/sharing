#encoding:utf-8

class BaseException(Exception):
    def __init__(self, description=None):
        self.description = description

    def __str__(self):
        return self.description

    def __repr__(self):
        return self.description


class OperateException(BaseException):
    pass
