# encoding: utf-8
from controller import comment
from ..filters import check_logged
from ..error import OutputError


def before():
    if check_logged() is False:
        raise OutputError('您还未登陆，请登陆后重试')


# comment.before_request(before)
