# encoding: utf-8
from flask import make_response, redirect, request, session, g, url_for, \
    render_template, Blueprint
import json
from core import get_auth_url, get_token, get_user_profile, photos
import uuid
from datetime import datetime, timedelta
from wtforms.validators import ValidationError

from ..filters import check_logged
# import error
from ..error import OutputError
from ..models import db, User
from ..forms import RegisterForm, LoginForm, AddPwdForm


account = Blueprint('account', __name__)


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
            return make_response(redirect(url_for('account.add_pwd')))
        else:
            raise OutputError('参数错误')


# 通过google oauth授权的，获取到个人信息，并且设置密码
@account.route('/add_pwd', methods=['GET', 'POST'])
def add_pwd():
    add_pwd_form = AddPwdForm()
    if request.method == 'GET':
        return render_template('add_pwd.html', add_pwd_form=add_pwd_form)
    else:
        if add_pwd_form.validate_on_submit():
            try:
                password = add_pwd_form.password
                email = session.get('user_profile')['email']
                nickname = session.get('user_profile')['nickname']
                image = session.get('user_profile')['image']
                user = User(email, password, nickname, image)
                db.session.add(user)
                db.session.commit()
                session.clear()
                session['user_id'] = user.id
                return make_response(redirect(url_for('share.list')))
            except ValueError:
                raise OutputError('参数错误')


@account.route('/login', methods=['GET', 'POST'])
def login():
    state = request.args.get('state', 'login')
    login_form = LoginForm()
    # 注册表单
    register_form = RegisterForm()
    if request.method == 'GET':
        # 是否已经登陆
        if check_logged():
            # 跳转到首页
            return make_response(redirect(url_for('share.list')))
    else:
        # Form.validate_on_submit()
        # 等价于 Form.is_submitted() and Form.validate()
        if login_form.validate_on_submit():
            user = User.query.filter(
                User.email == login_form.email).first() or None
            if user is not None and user.check_password(login_form.password):
                session['user_id'] = user.id
                session['email'] = user.email
                print user.email, type(user.id)
                response = make_response(redirect(url_for('share.list')))
                if login_form.remember_me is True:
                    delta = datetime.now() + timedelta(days=7)
                    response.set_cookie('email', user.email, expires=delta)
                    response.set_cookie(
                        'user_id', str(user.id), expires=delta)
                return response
            else:
                raise ValidationError('用户名或密码错误，请重新输入')

    # 渲染模板
    return render_template('login.html',
                           title='login',
                           state=state,
                           login_form=login_form,
                           register_form=register_form,
                           )


@account.route('/register', methods=['POST'])
def register():
    register_form = RegisterForm()

    # 当表单提交时
    try:
        if register_form.validate_on_submit():
            email = register_form.email
            if User.query.filter(User.email == email) is not None:
                raise ValidationError('该邮箱已经被使用')
            password = register_form.password
            nickname = register_form.nickname
            image = None

            # 添加到数据库
            user = User(email=email, password=password,
                        nickname=nickname, image=image)
            db.session.add(user)
            db.session.commit()

            # 添加session
            session['user_id'] = user.id
            session['email'] = user.email

            # 返回数据
            return make_response(redirect(url_for('share.list')))
    except ValidationError as e:
        print e.message

    # 输入有误时重新返回注册页
    return make_response(redirect(url_for('account.login', state='register')))


@account.route('/logout', methods=['GET'])
def logout():
    check_logged()
    session.clear()
    resp = make_response(redirect(url_for('account.login')))
    resp.set_cookie('email', expires=0)
    resp.set_cookie('user_id', expires=0)
    return resp


@account.route('/upload', methods=['POST'])
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


@account.route('/profile', methods=['POST'])
def profile():
    check_logged()
    args = request.form
    result = {}

    nickname = args['nickname'] if args.has_key(
        'nickname') else g.current_user.nickname
    password = args['password'] if args.has_key(
        'password') else g.current_user.password

    # 修改数据库
    g.current_user.nickname = nickname
    g.current_user.password = password
    db.session.add(g.current_user)
    db.commit()

    result['status'] = True

    return json.dumps(result)
