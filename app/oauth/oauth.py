# encoding: utf-8
from flask import make_response, redirect, request, Blueprint
import urllib2
import urllib
import json

bp = Blueprint('oauth', __name__)

url_prefix = 'https://accounts.google.com/o/oauth2'

params = {
        'RESPONSE_TYPE': 'code', 
        'CLIENT_ID': '619166640784-ddtj5snjjv01g26v6otfvns1ncissjd0.apps.googleusercontent.com', 
        'CLIENT_SECRET': 'zTE-_Ljfege61faalXKYTAyL', 
        'REDIRECT_URI': 'http://localhost:5000/oauth/redirect', 
        'SCOPE': 'email', 
        'STATE': 'abc', 
        'ACCESS_TYPE': 'online',
        'LOGIN_HINT': 'email' 
        }


@bp.route('/start')
def login():
    data = '?response_type=%s&client_id=%s&redirect_uri=%s&scope=%s&state=%s&access_type=%s&login_hint=%s' % (params['RESPONSE_TYPE'], params['CLIENT_ID'], params['REDIRECT_URI'], params['SCOPE'], params['STATE'], params['ACCESS_TYPE'], params['LOGIN_HINT'])
    data = url_prefix + '/auth' + data
    return make_response(redirect(data))

@bp.route('/redirect', methods=['GET', 'POST'])
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
    return res.read()


