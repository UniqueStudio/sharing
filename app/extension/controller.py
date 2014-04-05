#encoding: utf-8
from flask import Blueprint, request, session, send_from_directory
import json, os

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
    
    print 'info', email, password
    user = User.query.filter(User.email == email).first() or None
    if user is not None and user.check_password(password):
        session['user_id'] = user.id
        session['email'] = user.email
        result['success'] = True
    elif user is None:
        result['success'] = False
        result['errorCode'] = 1
    elif not user.check_password(password):
        result['success'] = False
        result['errorCode'] = 2

    return json.dumps(result)


@extension.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return json.dumps({'status': True})

@extension.route('/download_ext', methods=['GET'])
def download_ext():
    base_folder = os.getcwd()[0: -9]
    download_folder = os.path.join(os.getcwd(), 'download_files')
    print 'caonima', download_folder
    return send_from_directory(download_folder, 'chrome-extension.crx' ,as_attachment=True)


