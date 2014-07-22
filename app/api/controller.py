#coding:utf8
import json
from flask import request, g, Blueprint, session
import re

# import error
from ..error import OutputError
# import models
from ..models import db, Share, User

from ..filters import check_logged

import constances
from blacklist import BLACKLIST

pattern = []
for item in BLACKLIST:
    pattern.append(re.compile(item, re.DOTALL))


api = Blueprint('api', __name__)


@api.route('/islogged')
def islogged():
    #print 'islogged', request.cookies
    result = {}
    result['logged'] = check_logged()
    return json.dumps(result)


@api.route('/list')
def list():
    #print 'api', request.method, request.cookies
    per_page = constances.PER_PAGE
    if request.method == 'GET':
        order = Share.timestamp
        shares = Share.query.order_by(
            order.desc()).paginate(1, per_page, False)
        print shares, shares.items
        items = []
        if shares.items is not None:
            for item in shares.items:
                tmp = {
                    'id': item.id, 
                    'title': item.title, 
                    'explain': item.explain, 
                    'url': item.url, 
                    'likes': item.likes, 
                    'comments': item.comments_num, 
                    'timestamp': str(item.timestamp), 
                    'author_name': item.author.nickname, 
                    'author_image': item.author.image or '../static/img/default.jpg', 
                    'author_id': item.author.id, 
                    'is_collection': True
                    }
                items.append(tmp)
        return json.dumps(items)

    return 'error'


@api.route('/add', methods=['POST'])
def add():
    print 'add share, cookies', request.cookies
    if  session.has_key('user_id'):
        user = User.query.get(session['user_id'])
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
        
        for p in pattern:
            print p.match(url), url
            if p.match(url) is not None:
                raise OutputError('该条目不允许分享')
        
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
