# encoding: utf-8
import re

# import error
from error import OutputError

def check_email(email):
    pass

def check_password(pwd):
    pass

def check_nickname(nickname):
    pass

def check_image(image_url):
    pass

def check_logged():
    # import session
    from flask import session, g, request
    # import models
    from models import User
    
    if session.has_key('user_id'):
        user = User.get(session['user_id'])
        g.current_user = user
    elif request.cookies.get('user_id') is not None:
        user = User.get(request.cookies.get('user_id'))
        g.current_user = user
    else:
        raise OutputError('您还没有登陆，请先登陆')
