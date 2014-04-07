#encoding: utf-8
from flask import Blueprint, request, session, send_from_directory, g
import json, os

from ..models import db, User, Share
from ..error import OutputError


extension = Blueprint('extension', __name__)

@extension.route('/add', methods=['POST'])
def add():
    '''
    if not session.has_key('ext_user_id') or not session.has_key('ext_email'):
        if not request.cookies.has_key('email') or not request.cookies.get('password'):
            raise OutputError('您还未登录，请登录后重试')
        else:
            user = User.query.filter(User.email == request.cookies.get('email')).first()
            if user.password == request.cookies.get('password'):
                g.current_user = user
            else:
                raise OutputError('登录信息有误，请重新登录')
    else:
        user = User.query.get(session.get('ext_user_id'))
        if user.email is session.get('ext_email'):
            g.current_user = user
        else:
            raise OutputError('登录信息有误，请重新登录')
            '''
    if  session.has_key('ext_user_id'):
        user = User.query.get(session['ext_user_id'])
        g.current_user = user
    else:
        raise OutputError('您还未登录，请登录后重试')

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
    download_folder = os.path.join(os.getcwd(), 'download_files')
    print download_folder
    return send_from_directory(download_folder, 'chrome-extension.crx' ,as_attachment=True)
