#encoding: utf-8
from flask import Blueprint
from ..filters import check_logged

comment = Blueprint('comment', __name__)

comment.before_request(check_logged)
