#encoding:utf-8
from flask import render_template, redirect, url_for, session,\
        request, flash, abort, make_response, send_from_directory
from app import app, db
from models import Group, User, Share, Comment
from forms import RegisterForm, LoginForm, CommentForm
from datetime import datetime, timedelta
import json, md5
from config import constance




# users login and logout
@app.route('/login', methods = ['GET', 'POST'])
def login():
    error = None
    login_form = LoginForm()
    register_form = RegisterForm()
    if login_form.validate_on_submit():
        if login_form.validate():
            session['logged_in'] = True
            session['user_id'] = login_form.current_user()
            user = User.query.get(session['user_id'])
            redirect_to_index = redirect(url_for('index'))
            resp = make_response(redirect_to_index)
            if login_form.remember_me.data:
                resp.set_cookie('email',login_form.email.data, expires =
                        datetime.now() + timedelta(days=7), httponly=True)
                resp.set_cookie('pwd',
                        md5.new(login_form.password.data).hexdigest(),
                        expires = datetime.now() + timedelta(days=7),
                        httponly=True)
                return resp
            return resp 
        else:
            return redirect(url_for('login'))

    return render_template(constance['login'],
            title = 'login',
            login_form = login_form,
            register_form = register_form,
            error = error)

@app.route('/logout')
def logout():
    session.pop('logged_in',None)
    session.pop('user_id',None)
    redirect_to_login = redirect(url_for('login'))
    resp = make_response(redirect_to_login)
    resp.set_cookie('email', expires=0)
    resp.set_cookie('pwd', expires=0)
    return resp

@app.route('/register', methods = ['GET', 'POST'])
def register():
    error = None
    login_form = LoginForm()
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        if register_form.validate():
            #将username改为nickname by @Yang
            user = User(nickname = register_form.name.data,
                    email = register_form.email.data,
                    password = register_form.password.data)
            db.session.add(user)
            db.session.commit()
            session['logged_in'] = True
            session['user_id'] = user.id
            return redirect(url_for('index'))

    return render_template(constance['login'],
            title = 'login',
            login_form = login_form,
            register_form = register_form,
            error = error)

@app.route('/')
def redirect_to_index():
    if 'logged_in' not in  session:
        return redirect(url_for('login'))
    else:
        return redirect(url_for('index'))


@app.route('/index')
@app.route('/index/<int:page>')
def index(page=1):
    
    current_user = None
   
    if 'logged_in' not in  session:
        return redirect(url_for('login'))

    # 处理cookies
    if 'user_id' in session:
        user_id = session['user_id']
        if user_id:
            current_user = User.query.get(user_id)
    else:
        email = request.cookies.get('email')
        pwd = request.cookies.get('pwd')
        user = User.query.filter_by(email = email).first()
        if user and user.pwdhash == pwd:
            session['logged_in'] = True
            session['user_id'] = user.id
            current_user = user

    # 获取查询的group_id来得到指定group中的share
    group_id = request.args.get('group_id', '') or None

    if group_id is not None:
        group = Group.query.get(group_id)
    else:
        group = current_user.groups.first()

    # 获取当前加入该群组的所有用户信息
    if group is not None:
        user_id_list = [user.id for user in group.users.all()]
    else:
        user_id_list = []

    # recommended shares order_by likes
    recommends = Share.query.order_by(Share.likes.desc())[0:5]

    # 获取查询参数中的排序信息, 默认为按时间排序
    order_by = request.args.get('order_by', '') or 'likes'
    if order_by == 'timestamp':
        order = Share.timestamp
    else:
        order = Share.likes

    # 读取分享信息
    shares = Share.query.filter(Share.user_id.in_(user_id_list)).order_by(order.desc()).paginate(page, constance['per_page'],
                False)
    
    current_url = 'index'
    # if current_url.find('/') == 0:
        # current_url = current_url[1:]

    return render_template(constance['index'],
            current_url = current_url, 
            order_by = order_by, 
            shares = shares,
            current_group_id = group_id, 
            current_user = current_user,
            recommends = recommends,
            title = 'home')

'''
@app.route('/index_hot')
@app.route('/index_hot/<int:page>')
def index_hot(page=1):
    
    if 'logged_in' in  session:
        pass
    else:
        return redirect(url_for('login'))

    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        if user_id:
            user = User.query.get(user_id)

    group_id = request.args.get('group_id', '') or None

    # pick shares by group
    groups = []
    if group_id is not None:
        groups.append(Group.query.get(group_id))

    user_id_list = []
    for group in groups:
        user_id_list.extend([user.id for user in group.users])

    if user_id_list != []:
        shares = Share.query.filter(Share.user_id.in_(user_id_list)).order_by(Share.likes.desc(), 
                Share.timestamp.desc()).paginate(page, constance['per_page'], False)
    else:
        shares = None

    # @ by guoqi
    # add groups 
    all_groups = list(Group.query.all()) or None
    user_groups = list(user.groups.all()) or None
    diff_groups = None
    if all_groups and user_groups:
        diff_groups = list(set(all_groups).difference(set(user_groups))) 
    elif all_groups:
        diff_groups = all_groups


    current_url = 'index_hot'
    # if current_url.find('/') == 0:
        # current_url = current_url[1:]

    # recommended shares order_by likes
    recommends = Share.query.order_by(Share.likes.desc())[0:4]

    return render_template(constance['index'],
            current_url = current_url, 
            shares = shares,
            current_group_id = group_id, 
            current_user = user,
            recommends = recommends,
            user_groups = user_groups, 
            diff_groups = diff_groups, 
            title = 'home')
'''

@app.route('/profile/')
@app.route('/profile/<profile_desc>')
def profile(profile_desc=''):
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        # 这儿的order_by有问题
        # profile 是干嘛的?
        shares = Share.query.filter_by(user_id =
                user_id).order_by(Share.timestamp.desc()).all()
    else:
        return redirect(url_for('login'))
    
    if profile_desc == 'desc':
        shares.reverse()
        profile_desc = ''
    elif profile_desc == '':
        profile_desc = 'desc'
    # TODO
    #else:
        #error

    # recommended shares order_by likes
    recommends = Share.query.order_by(Share.likes.desc())[0:4]

    return render_template(constance['profile'],
            shares = shares,
            current_user = user,
            profile_desc = profile_desc, 
            recommends = recommends,
            title = 'profile')

    #  ajax toggle likes   --zs
@app.route('/toggleLikes', methods = ['POST'])
def toggleLikes():
    share_id = request.form['shareID']
    share = Share.query.get(share_id)
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        if user.is_like(share):
            user.dislike(share)
        else:
            user.like(share)
        db.session.add(share)
        db.session.commit()
        resp = {}
        resp['userLike'] = user.is_like(share)
        resp['likeNum'] = share.likes
        return json.dumps(resp)
    else:
        return redirect(url_for('login'))


@app.route('/reading/<int:id>')
def reading(id):
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
    else:
        return redirect(url_for('login'))
    shares = Share.query.all()
    share = Share.query.get(id)
    comments = share.comments.order_by(Comment.id.desc())
    return render_template(constance['reading'],
            share = share,
            shares = shares,
            comments = comments,
            user = user,
            title = 'home')

@app.route('/add_comment', methods = ['POST'])
def add_comment():
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
    else:
        return redirect(url_for('login'))

    c = Comment(body = request.form['comment_body'],
            share_id = request.form['share_id'],
            user_id = session['user_id'])
    db.session.add(c)
    db.session.commit()
    resp = {}
    resp['c_body'] = c.body
    resp['user_avatar_src'] = user.avatar(50)
    return json.dumps(resp)

@app.route('/load_comments', methods = ['POST'])
def load_comments():
    share_id = request.form['share_id']
    page = request.form['page']
    share = Share.query.get(share_id)
    comments = share.comments.order_by(Comment.id.desc()).paginate(page,
            constance['per_page'], False)

# 切换关注/取消关注群组
@app.route('/toggle_group', methods = ['POST'])
def toggle_group():
    if request.method == 'POST':
        group_id = request.form['group_id']
        group = Group.query.get(group_id)
        # result
        result = {}
        if 'logged_in' in session:
            user_id = session['user_id']
            user = User.query.get(user_id)
            if group.is_attentioned(user):
                user.remove_from_group(group)
            else:
                user.add_to_group(group)
            db.session.commit()
            result['status'] = True
        else:
            result['status'] = False
            result['msg'] = 'not logged'
        return json.dumps(result)
    else:
        abort(404)

# 查询用户的群组信息
@app.route('/query_group', methods = ['POST'])
def query_group():
    if request.method == 'POST':
        result = {}
        if 'logged_in' in session:
            user_id = session['user_id']
            user = User.query.get(user_id)
            user_groups = user.groups.all()
            all_groups = Group.query.all()
            diff_groups = list(set(all_groups).difference(set(user_groups)))
            i = 0
            for group in user_groups:
                result['user_groups'][i] = {
                                            'group_name': group.title,
                                            'group_id': group.id, 
                                            'group_creator': group.creator.username
                                            }
                i = i+1
            i = 0
            for group in diff_groups:
                result['diff_groups'][i] = {
                                            'group_name': group.tilte, 
                                            'group_id': group.id,
                                            'group_creator': group.creator.username
                                            }
                i = i+1
            result['status'] = True
        else:
            result['status'] = False
            result['msg'] = 'not logged'
        return json.dumps(result)
    else:
        abort(404)


# 创建群组
@app.route('/create_group', methods = ['POST'])
def create_group():
    if request.method == 'POST':
        group_name = request.form['group_name']
        # result
        result = {}
        if 'logged_in' in session:
            user_id = session['user_id']
            group = Group(group_name, user_id)
            db.session.add(group)
            db.session.commit()
            result['status'] = True
            return json.dumps(result)
        else:
            result['status'] = False
            result['msg'] = 'not logged'
            return json.dumps(result)
    else:
        abort(404)

#  download files  -- extension
@app.route('/download/<path:filename>')
def download(filename):
    return send_from_directory(constance['download_folder'],
            filename, as_attachment=True)


###################################################################
######### Extension
###################################################################

# chrome extension 
@app.route('/extension/login', methods = ['GET', 'POST'])
def ext_login():
    resp = {}
    if request.method == 'POST':
        email = request.form['email']
        pwd = request.form['pwd']
        user = User.query.filter_by(email = email).first()
        if not user:
            resp['success'] = False
            resp['errorCode'] = 1
        elif  user.pwdhash != pwd:
            resp['success'] = False
            resp['errorCode'] = 2
        else:
            session['logged_in'] = True
            session['user_id'] = user.id
            resp['success'] = True
    return json.dumps(resp)

@app.route('/extension/logout')
def ext_logout():
    resp = {}
    resp['success'] = True 
    session.pop('logged_in',None)
    session.pop('user_id',None)
    print 'logout ext'
    return json.dumps(resp)

@app.route('/extension/share', methods = ['GET', 'POST'])
def ext_share():
    resp = {}
    if request.method == 'POST':
        if 'logged_in' in session: 
            s = Share.query.filter_by(url = request.form['url']).first()
            if not s:
                share = Share(url = request.form['url'],
                        title = request.form['title'],
                        explain = request.form['explain'],
                        timestamp = datetime.now())
                share.user_id = session['user_id']
                db.session.add(share)
                db.session.commit()
                resp['success'] = True 
            else:
                resp['success'] = False
                resp['errorCode'] = 2
        else:
            resp['success'] = False
            resp['errorCode'] = 1
    return json.dumps(resp)


