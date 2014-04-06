#encoding: utf-8
from flask import Blueprint, request, session, send_from_directory
import json, os

from ..models import db, User, Share
from ..error import OutputError


extension = Blueprint('extension', __name__)

@extension.route('/add', methods=['POST'])
def add():
    if not session.has_key('ext_user_id'):
        return OutputError('not logined')

    args = request.form
    result = {}
    if args.has_key('title') and args.has_key('url'):
        title = args['title']
        explain = args['explain'] if args.has_key('explain') else None
        url = args['url']
        user_id = g.current_user.id
        
        if Share.query.filter(Share.url == url).first():
            raise OutputError('该条目已经被分享过了')

        # 添加到数据库
        share = Share(title=title, explain=explain,
                      url=url, user_id=user_id)
        db.session.add(share)
        db.session.commit()
        result['status'] = True
        return json.dumps(result)
    else:
        raise OutputError('参数错误')

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
        session['ext_user_id'] = user.id
        session['ext_email'] = user.email
        result['success'] = True
    elif user is None:
        result['success'] = False
        result['errorCode'] = 1
    elif not user.check_password(password):
        result['success'] = False
        result['errorCode'] = 2

    return json.dumps(result)


@extension.route('/logout', methods=['GET'])
def logout():
    session['ext_user_id'] = None 
    session['ext_email'] = None  
    return json.dumps({'status': True})

@extension.route('/download_ext', methods=['GET'])
def download_ext():
    base_folder = os.getcwd()[0: -9]
    download_folder = os.path.join(os.getcwd(), 'download_files')
    print 'caonima', download_folder
    return send_from_directory(download_folder, 'chrome-extension.crx' ,as_attachment=True)


