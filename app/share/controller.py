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
                        'author_id': item.author.id
                        }
                items.append(tmp)
                

        # 返回结果
        result = {}
        result['status'] = True
        result['result'] = items
        result['length'] = len(shares.items)

        return json.dumps(result)


@share.route('/toggleLikes', methods=['POST'])
def toggleLikes():
    result = []
    args = request.form
    if args.has_key('share_id'):
        share = Share.query.get(args['share_id']) or None
        if g.current_user.is_like(share):
            g.current_user.dislike(share)
        else:
            g.current_user.like(share)
        db.session.add(share)
        db.session.commit()
        result['status'] = True

    else:
        raise OutputError('参数错误')

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
        result['url'] = next_share.url
    else:
        result['status'] = False
        result['msg'] = '未找到前一项'

    return json.dumps(result)
        


@share.route('/shuffle', methods=['POST'])
def shuffle():
    shares = Share.query.all()
    r_index = random.randint(0, len(shares) - 1)
    result = {}
    result['status'] = True
    result['result'] = {
            'url': shares[r_index].url, 
            'id': shares[r_index].id
            }
    return json.dumps(result)

