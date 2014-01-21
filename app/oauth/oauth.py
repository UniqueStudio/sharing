# encoding: utf-8
from flask import make_response, redirect, request, Blueprint
import json
from core import get_auth_url, get_token, get_user_profile
import uuid

bp = Blueprint('oauth', __name__)


# 访问获取code
@bp.route('/auth')
def login():
    state = str(uuid.uuid4())
    return make_response(redirect(get_auth_url(state)))

# 验证登陆请求, 并获取个人信息
@bp.route('/connect', methods=['GET', 'POST'])
def oauth():
    # 获取token
    if request.method == 'GET':
        code = request.args.get('code', '')
        token = json.loads(get_token(code))['access_token']
        # 获取用户信息
        return get_user_profile(token)



