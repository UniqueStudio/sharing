#encoding: utf-8

from flask import Blueprint
from ..filters import check_logged

share = Blueprint('share', __name__)

share.before_request(check_logged)
