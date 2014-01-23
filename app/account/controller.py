# encoding: utf-8
from account import account
from flask import make_response, redirect, request, session, g
import json
from core import get_auth_url, get_token, get_user_profile
import uuid

from ..filters import check_logged, check_email, check_password, check_nickname, check_image

# import error
from ..error import OutputError

from ..models import User

from ..app import db



# 访问获取code
@account.route('/auth')
def auth():
    state = str(uuid.uuid4())
    return make_response(redirect(get_auth_url(state)))

# 验证登陆请求, 并获取个人信息
@account.route('/connect', methods=['GET', 'POST'])
def oauth():
    # 获取token
    if request.method == 'GET':
        code = request.args.get('code', '')
        token = json.loads(get_token(code))['access_token']
        # 获取用户信息
        return get_user_profile(token)


@account.route('/login', methods = ['POST'])
def login():
    pass

@account.route('/register', methods = ['POST'])
def register():
    args = request.form
    result = {}
    if args.has_key('email') and args.has_key('password') and args.has_key('nickname'):
        email = args['email']
        password = args['password']
        nickname = args['nickname']
        image = None

        if args.has_key('image'):
           # 保存用户头像
            pass
    
        # check args
        check_email(email)
        check_password(password)
        check_nickname(nickname)
        check_image(image)

        # 添加到数据库
        user = User(email = email, password = password, nickname = nickname, image = image)
        db.session.add(user)
        db.session.commit()

        # 添加session
        session['user_id'] = user.id
        session['email'] = user.email

        # 返回数据
        result['status'] = True
        return json.dumps(result)
    else:
        raise OutputError('参数错误')


@account.route('/logout', methods = ['POST'])
def logout():
    result = {}
    check_logged()
    session.clear()
    request.cookies.clear()
    result['status'] = True
    return json.dumps(result)


@account.route('/upload', methods = ['POST'])
def upload():
    pass


@account.route('/profile', methods = ['POST'])
def profile():
    check_logged()
    args = request.form
    result = {}
    
    nickname = args['nickname'] if args.has_key('nickname') else g.current_user.nickname
    password = args['password'] if args.has_key('password') else g.current_user.password

    # 修改数据库
    g.current_user.nickname = nickname
    g.current_user.password = password
    db.session.add(g.current_user)
    db.commit()

    result['status'] = True

    return json.dumps(result)
