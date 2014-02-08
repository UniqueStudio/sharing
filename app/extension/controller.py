#encoding: utf-8
from flask import Blueprint, request, session
import json

from ..models import User
from ..error import OutputError


extension = Blueprint('extension', __name__)

@extension.route('/login', methods=['POST'])
def login():
    args = request.form
    result = {}
    try:
        email = args.get('email')
        password = args.get('password')
    except ValueError:
        raise OutputError('参数错误')
    
    user = User.query.filter(User.email == email).first() or None
    if user is not None and user.check_password(password):
        session['user_id'] = user.id
        session['email'] = user.email
        result['status'] = True
    else:
        result['status'] = False
        result['msg'] = '用户名或密码错误'

    return json.dumps(result)

@extension.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return json.dumps({'status': True})

