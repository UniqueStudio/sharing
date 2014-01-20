# encoding: utf-8
from flask import make_response, redirect, request, Blueprint
import urllib2
import urllib
import json
from ..config import params

bp = Blueprint('oauth', __name__)

url_prefix = 'https://accounts.google.com/o/oauth2'


# 访问获取code
@bp.route('/login')
def login():
    str = ''
    for scope in params['SCOPE']:
        str += scope
        str += '+'

    data = '?response_type=%s&client_id=%s&redirect_uri=%s&scope=%s&state=%s&access_type=%s&login_hint=%s' % (params['RESPONSE_TYPE'], params['CLIENT_ID'], params['REDIRECT_URI'], str, params['STATE'], params['ACCESS_TYPE'], params['LOGIN_HINT'])
    data = url_prefix + '/auth' + data
    return make_response(redirect(data))

# 验证登陆请求, 并获取个人信息
@bp.route('/oauth', methods=['GET', 'POST'])
def oauth():
    # 第一次redirect
    data = {
            'code': request.args.get('code', ''), 
            'client_id': params['CLIENT_ID'], 
            'client_secret': params['CLIENT_SECRET'], 
            'redirect_uri': params['REDIRECT_URI'], 
            'grant_type': 'authorization_code'
            }
    data = urllib.urlencode(data)
    url = url_prefix + '/token'
    req = urllib2.Request(url, data=data)
    res = urllib2.urlopen(req)
    oauth = json.loads(res.read())
    token = oauth['access_token']

    url_people = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + token
    req = urllib2.Request(url_people)
    res = urllib2.urlopen(req)
    id = json.loads(res.read())['id']

    url_user = 'https://www.googleapis.com/admin/directory/v1/users/' + id + '?access_token' + token
    req = urllib2.Request(url_user)
    res = urllib2.urlopen(req)

    print res.read()


