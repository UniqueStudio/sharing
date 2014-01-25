# encoding: utf-8

class ErrorBase(Exception):
    pass


class InternalError(ErrorBase):
    def __init__(self, msg, expr):
        self.msg = msg
        self.expr = expr



class OutputError(ErrorBase):
    def __init__(self, msg):
        self.msg = msg

    def __repr__(self):
        print '<OutputError: %s>' % self.msg
