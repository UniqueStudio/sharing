# encoding: utf-8
from account import account
from flask import make_response, redirect, request, session, g, url_for
import json
from core import get_auth_url, get_token, get_user_profile, photos
import uuid
from datetime import datetime, timedelta

from ..filters import check_logged, check_email, check_password, check_nickname, check_image

# import error
from ..error import OutputError

from ..models import User

from ..app import db



# 访问获取code
@account.route('/auth')
def auth():
    state = str(uuid.uuid4())
    session['state'] = state
    return make_response(redirect(get_auth_url(state)))

# 验证登陆请求, 并获取个人信息
@account.route('/connect', methods=['GET'])
def connect():
    # 获取token
    if request.method == 'GET':
        state = request.args.get('state', '')
        # 验证state, 防止uri被修改
        if session.has_key('state') and session['state'] == state:
            code = request.args.get('code', '')
            token = json.loads(get_token(code))['access_token']

            # 获取用户信息
            user_profile = get_user_profile(token)
            
            # 如果该用户以前授权过, 则直接跳转到首页
            if User.is_exist(user_profile['email']):
                user = User.query.filter(User.email ==
                        user_profile['email']).first()
                session['user_id'] = user.id
                session['email'] = user.email
                return make_response(redirect(url_for('share.list')))

            # 删除state, 并加入user_profile
            session.pop('state')
            session['user_profile'] = user_profile
            # 重定向到添加本站密码的页面
            return make_response(redirect(url_for('add_pwd')))
        else:
            raise OutputError('参数错误')


# 通过google oauth授权的，获取到个人信息，并且设置密码
@account.route('/add_pwd', methods = ['POST'])
def add_pwd():
    try:
        password = request.get('password')
        email = session.get('user_profile')['email']
        nickname = session.get('user_profile')['nickname']
        image = session.get('user_profile')['image']
        user = User(email, password, nickname, image)
        db.session.add(user)
        db.commit()
        return json.dumps({'result': True})
    except ValueError:
        raise OutputError('参数错误')
        


@account.route('/login', methods = ['POST'])
def login():
    args = request.form
    try:
        email = args.get('email')
        password = args.get('password')
        remember_me = args.get('remember_me', type=bool)
        user = User.query.filter(User.email == email).first() or None
        if user is not None and user.check_password(password):
            session['user_id'] = user.id
            session['email'] = user.email
            response = make_response(redirect(url_for('share.list')))
            if remember_me is True:
                delta = datetime.now() + timedelta(days=7)
                response.set_cookie('email', user.email, expires = delta)
                response.set_cookie('user_id', user.id, expires = delta)
            return response
        else:
            raise OutputError('密码错误，请重新输入')
    except ValueError:
        raise OutputError('参数错误')

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
    if 'image' in request.files:
        filename = uuid.uuid1()
        photos.save(request.files['image'], name=filename)
        url = photos.url(filename)
        result = {
                'status': True, 
                'result': {'url': url}
                }
        return json.dumps(result)


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
