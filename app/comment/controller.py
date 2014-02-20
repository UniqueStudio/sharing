#encoding: utf-8
import json
from flask import request, g, render_template, Blueprint

# import error
from ..error import OutputError
# import models
from ..models import db, Comment
# import constances
import constances


comment = Blueprint('comment', __name__)

@comment.route('/add', methods = ['POST'])
def add():
    args = request.form
    if args.has_key('share_id') and args.has_key('content'):
        try:
            share_id = args.get('share_id', type=int)
            content = args.get('content', type=str)
        except ValueError:
            raise OutputError('参数错误')
        # 添加评论
        # comment = Comment(content, g.current_user.id, share_id)
        comment = Comment(content, 1, share_id)
        db.session.add(comment)
        db.session.commit()
        return json.dumps({'status':  True})
    else:
        raise OutputError('参数错误')

    
@comment.route('/list', methods = ['GET'])
def list():
    args = request.args
    if args.has_key('start') and args.has_key('share_id'):
        try:
            start = args.get('start', 1, type=int)
            share_id = args.get('share_id', type=int) 
        except ValueError:
            raise OutputError('参数错误')
        per_page = constances.PER_PAGE

        # 拉取数据并渲染为HTML片段
        comments = Comment.query.filter(Comment.share_id == share_id).order_by(Comment.timestamp.desc()).paginate(start, per_page, False)
        result = {}
        result['status'] = True
        result['result'] = render_template('comment_snippet', comments = comments)
        return json.dumps(result)
    else:
        raise OutputError('参数错误')
