#coding: utf8
import urllib
import urllib2
import cookielib
import re

cookie = cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookie))
urllib2.install_opener(opener)

login_url = 'http://localhost:5000/account/login'

response = urllib2.urlopen(login_url)

m = re.compile('<input id="csrf_token" name="csrf_token" type="hidden" value=".+">', re.DOTALL)

# m = re.compile('<div style="display:none;">.*</div>', re.DOTALL)

result = re.findall(m, response.read())

string = 'value="'

token = result[0][result[0].find(string) + len(string):result[0].find('">')]

login = {
        'csrf_token': token, 
        'email_field': 'uniqueguoqi@gmail.com', 
        'password_field': 2, 
        'remember_me_field': 'y'
        }

data = urllib.urlencode(login)

response = urllib2.urlopen(login_url, data)

like_url = 'http://localhost:5000/share/toggleLikes'

like = {
        'share_id': 6
        }

data = urllib.urlencode(like)

request = urllib2.Request(like_url, data)

cookie.add_cookie_header(request)

print request.get_header('Cookie')

response = urllib2.urlopen(request)

print response.read()
