import urllib
import urllib2
import json
from flaskext.uploads import UploadSet, ALL

URL_AUTH = 'https://accounts.google.com/o/oauth2/auth'
URL_TOKEN = 'https://accounts.google.com/o/oauth2/token'
# URL_PEOPLE = 'https://www.googleapis.com/plus/v1/people/me'
URL_PEOPLE = 'https://www.googleapis.com/oauth2/v2/userinfo'



RESPONSE_TYPE = 'code' 
# CLIENT_ID = '619166640784-ddtj5snjjv01g26v6otfvns1ncissjd0.apps.googleusercontent.com'
# CLIENT_SECRET = 'zTE-_Ljfege61faalXKYTAyL'
# REDIRECT_URI = 'http://localhost:5000/account/connect'
# SCOPE = ['email', 'https://www.googleapis.com/auth/admin.directory.user'] 
SCOPE = 'email'
ACCESS_TYPE = 'online'
LOGIN_HINT = 'email' 


photos = UploadSet('photos', ALL, default_dest=lambda app: 'app/static/uploads')

PHOTO_PREFIX = '../static/uploads/'


f = open('app/client_secret.json', 'r')
web = json.loads(f.read())['web']
f.close()
CLIENT_SECRET = web['client_secret']
REDIRECT_URI = web['redirect_uris'][0]
CLIENT_ID = web['client_id']


class MyRequest(object):
    def __init__(self, url, data={}, method='GET'):
        self._url = url
        self._data = data
        if method in ('GET', 'POST'):
            self._method = method
        else:
            raise 'error method'

    @property
    def url(self):
        return self._url

    def wrap_url(self):
        if self._method == 'GET':
            self._url += '?'
            for (key, value) in self._data.items():
                str = key + '=' + value + '&'
                self._url += str
            self.req = urllib2.Request(self._url)
        elif self._method == 'POST':
            data = urllib.urlencode(self._data)
            self.req = urllib2.Request(self._url, data=data)

    def request(self):
        self.wrap_url()
        return urllib2.urlopen(self.req).read()
                

def get_auth_url(state):
    data = {
            'response_type': RESPONSE_TYPE, 
            'client_id': CLIENT_ID, 
            'redirect_uri': REDIRECT_URI, 
            'scope': SCOPE, 
            'access_type': ACCESS_TYPE, 
            'login_hint': LOGIN_HINT, 
            'state': state, 
            'hd': 'hustunique.com'
            }
    req = MyRequest(URL_AUTH, data)
    req.wrap_url()
    return req.url


def get_token(code):
    data = {
            'code': code, 
            'client_id': CLIENT_ID, 
            'client_secret': CLIENT_SECRET, 
            'redirect_uri': REDIRECT_URI, 
            'grant_type': 'authorization_code'
            }
    req = MyRequest(URL_TOKEN, data, 'POST')
    return req.request()

    
def get_user_profile(token):
    data = {
            'access_token': token
            }
    req = MyRequest(URL_PEOPLE, data)
    profile_json = json.loads(req.request())

    display_name = profile_json['name']
    image = profile_json['picture']

    email = profile_json['email']
    # for i in emails:
        # if i['type'] == 'account':
            # email = i['value']
            # break

    user_profile = {
                    'email': email, 
                    'nickname': display_name, 
                    'image': image 
                    }
    return user_profile
                
    
