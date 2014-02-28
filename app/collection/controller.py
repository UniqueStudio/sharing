#coding:utf8
import json
from flask import request, g, Blueprint

# import error
from ..error import OutputError
# import models
from ..models import db, Share

import constances

collection = Blueprint('collection', __name__)


@collection.route('/toggleCollection', methods=['POST'])
def toggleCollection():
    args = request.form
    result = {}
    try:
        share_id = args.get('share_id', type=int)
    except ValueError:
        raise OutputError('参数错误')

    share = Share.query.get(share_id)
    if g.current_user.is_in_the_collections(share):
        g.current_user.remove_from_collections(share)
    else:
        g.current_user.add_to_collections(share)
    db.session.add(g.current_user)
    db.session.commit()

    result['status'] = True
    return json.dumps(result)


@collection.route('/list', methods=['POST'])
def list():
    args = request.form
    result = {}
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

    id_list = g.current_user.collections.all()['share_id']

    shares = Share.query.filter(Share.id in
            id_list).order_by(order.desc()).paginate(start, per_page, False)

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

    result['status'] = True
    result['result'] = items
    result['length'] = len(shares.items)

    return json.dumps(result)
