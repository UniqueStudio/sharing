# encoding: utf-8
import json
from flask import request, g, render_template, Blueprint
import random

# import error
from ..error import OutputError
# import models
from ..models import db, Share
import constances

share = Blueprint('share', __name__)


@share.route('/add', methods=['POST'])
def add():
    args = request.form
    result = {}
    if args.has_key('title') and args.has_key('url'):
        title = args['title']
        explain = args['explain'] if args.has_key('explain') else None
        url = args['url']
        user_id = g.current_user.id

        # 添加到数据库
        share = Share(title=title, explain=explain,
                      url=url, user_id=user_id)
        db.session.add(share)
        db.session.commit()
        result['status'] = True
        return json.dumps(result)
    else:
        raise OutputError('参数错误')


@share.route('/list', methods=['GET', 'POST'])
def list():
    if request.method == 'GET':
        return render_template('index.html', current_user=g.current_user)

    args = request.form
    if args.has_key('start') and args.has_key('sortby'):
        try:
            start = args.get('start', 1, type=int)
            sortby = args.get('sortby', 'timestamp')
            per_page = constances.PER_PAGE
        except ValueError:
            raise OutputError('参数错误')

        if sortby not in ('timestamp', 'likes'):
            raise OutputError('参数错误')

        if sortby == 'timestamp':
            order = Share.timestamp
        else:
            order = Share.likes

        shares = Share.query.order_by(
            order.desc()).paginate(start, per_page, False)

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
                        'is_collection': False, 
                        'is_like': g.current_user.is_like(item)
                        }
                if g.current_user.is_in_the_collections(item):
                    tmp['is_collection'] = True
                items.append(tmp)

        # 返回结果
        result = {}
        result['status'] = True
        result['result'] = items
        result['length'] = len(shares.items)

        return json.dumps(result)


@share.route('/toggleLikes', methods=['POST'])
def toggleLikes():
    result = {}
    args = request.form
    try:
        share_id = args.get('share_id', type=int)
    except ValueError:
        raise OutputError('参数错误')
    share = Share.query.get(share_id) or None
    if g.current_user.is_like(share):
        g.current_user.dislike(share)
        result['result'] = 'notlike'
    else:
        g.current_user.like(share)
        result['result'] = 'like'
    db.session.add(g.current_user)
    db.session.commit()
    result['status'] = True

    return json.dumps(result)


@share.route('/next', methods=['POST'])
def detail():
    args = request.form
    try:
        method = args.get('method')
        id = args.get('id', 1, type=int)
    except ValueError:
        raise OutputError('参数错误')

    if method not in ('previous', 'after'):
        raise OutputError('参数错误')

    cur_share = Share.query.get(id) or None

    result = {}
    if method == 'previous':
        next_share = cur_share.previous()
    elif method == 'after':
        next_share = cur_share.after()

    if next_share is not None:
        result['status'] = True
        result['result'] = {
                'id': next_share.id, 
                'title': next_share.title, 
                'explain': next_share.explain, 
                'url': next_share.url, 
                'likes': next_share.likes, 
                'comments': next_share.comments_num, 
                'timestamp': str(next_share.timestamp), 
                'author_name': next_share.author.nickname, 
                'author_image': next_share.author.image or '../static/img/default.jpg', 
                'author_id': next_share.author.id, 
                'is_collection': False, 
                'is_like': g.current_user.is_like(next_share)
                }
        if g.current_user.is_in_the_collections(next_share):
            result['result']['is_collection'] = True
    else:
        result['status'] = False
        result['msg'] = '未找到前一项'

    return json.dumps(result)
        


@share.route('/shuffle', methods=['POST'])
def shuffle():
    shares = Share.query.all() or None
    result = {}
    if shares is not None:
        r_index = random.randint(0, len(shares) - 1)
        result['status'] = True
        result['result'] = {
                'id': shares[r_index].id, 
                'title': shares[r_index].title, 
                'explain': shares[r_index].explain, 
                'url': shares[r_index].url, 
                'likes': shares[r_index].likes, 
                'comments': shares[r_index].comments_num, 
                'timestamp': str(shares[r_index].timestamp), 
                'author_name': shares[r_index].author.nickname, 
                'author_image': shares[r_index].author.image or '../static/img/default.jpg',
                'author_id': shares[r_index].author.id, 
                'is_collection': False, 
                'is_like': g.current_user.is_like(shares[r_index])
                }
        if g.current_user.is_in_the_collections(shares[r_index]):
            result['result']['is_collection'] = True
    else:
        result['status'] = False
    return json.dumps(result)

