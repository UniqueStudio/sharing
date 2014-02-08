# encoding: utf-8
import json
from flask import request, g, render_template, Blueprint

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
        return render_template('index.html', current_user = g.current_user)

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

        # 渲染HTML片段
        result = {}
        result['status'] = True
        result['result'] = render_template('share_snippet.html', shares=shares)

        return json.dumps(result)


@share.route('/detail', methods=['GET'])
def detail():
    # TODO
    pass

