# encoding: utf-8
from controller import share
from ..filters import check_logged
# import error
from ..error import OutputError


def before():
    if check_logged() is False:
        raise OutputError('您还未登陆，请登陆后重试')


share.before_request(before)
