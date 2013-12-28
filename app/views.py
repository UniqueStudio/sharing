#encoding:utf-8
from flask import render_template, redirect, url_for, session,\
        request, flash, abort, make_response
from app import app, db
from models import Group, User, Share, Comment
from forms import RegisterForm, LoginForm, CommentForm
from datetime import datetime
import json
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
            return redirect(url_for('index'))
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
    flash("you were logged out")
    return redirect(url_for('login'))

@app.route('/register', methods = ['GET', 'POST'])
def register():
    error = None
    login_form = LoginForm()
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        user = User(username = register_form.name.data,
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
@app.route('/index/<int:page>')
@app.route('/index/<index_desc>/<int:page>')
def index(index_desc='', page=1):
    if 'logged_in' in  session:
        pass
    else:
        return redirect(url_for('login'))

    PER_PAGE = 3
    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        if user_id:
            user = User.query.get(user_id)

    shares = Share.query.order_by(Share.timestamp).paginate(page, PER_PAGE,
            False)

    # @ by guoqi
    # add groups 
    all_groups = list(Group.query.all()) or None
    user_groups = list(user.groups.all()) or None
    diff_groups = None
    if all_groups and user_groups:
        diff_groups = list(set(all_groups).difference(set(user_groups))) 
    elif all_groups:
        diff_groups = all_groups

    # if desc
    if index_desc == 'desc':
        shares.reverse()
        index_desc = ''
    elif index_desc == '': 
        index_desc = 'desc'

    return render_template(constance['index'],
            shares = shares,
            current_user = user,
            user_groups = user_groups, 
            diff_groups = diff_groups, 
            index_desc = index_desc, 
            index_hot_desc = 'desc',
            title = 'home')

@app.route('/index_hot/')
@app.route('/index_hot/<index_hot_desc>')
def index_hot(index_hot_desc=''):
    
    if 'logged_in' in  session:
        pass
    else:
        return redirect(url_for('login'))

    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        if user_id:
            user = User.query.get(user_id)

    shares = Share.query.order_by(Share.likes).all()
    if index_hot_desc == 'desc':
        shares.reverse()
        index_hot_desc = ''
    elif index_hot_desc == '':
        index_hot_desc = 'desc'

    return render_template(constance['index'],
            shares = shares,
            current_user = user,
            index_desc='desc',
            index_hot_desc = index_hot_desc, 
            title = 'home')

@app.route('/profile/')
@app.route('/profile/<profile_desc>')
def profile(profile_desc=''):
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        # 这儿的order_by有问题
        # profile 是干嘛的?
        shares = Share.query.filter_by(user_id = user_id).order_by(Share.timestamp).all()
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

    return render_template(constance['profile'],
            shares = shares,
            current_user = user,
            profile_desc = profile_desc, 
            title = 'profile')

@app.route('/likes', methods = ['POST'])
def likes():
    share_id = request.form['share_id']
    share = Share.query.get(share_id)
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.like(share)
        share.likes += 1
        # db.session.add(like)
        db.session.add(share)
        db.session.commit()
        return "success"
    else:
        return redirect(url_for('login'))

@app.route('/dislikes', methods = ['POST'])
def dislikes():
    share_id = request.form['share_id']
    share = Share.query.get(share_id)
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.dislike(share)
        share.likes -= 1
        # db.session.add(dislike)
        db.session.add(share)
        db.session.commit()
        return "success"
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
    comments = share.comments
    return render_template("reading.html",
            share = share,
            shares = shares,
            comments = comments,
            user = user,
            title = 'home')

@app.route('/add_comment', methods = ['POST'])
def add_comment():
    c = Comment(body = request.form['comment_body'],
            share_id = request.form['share_id'],
            user_id = session['user_id'])
    db.session.add(c)
    db.session.commit()
    return 'success'

# 对群组加关注
@app.route('/add_attention_to_group/', methods = ['POST'])
def add_attention_to_group():
    group_id = request.form['group_id']
    group = Group.query.get(group_id)
    if 'logged_in' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.add_to_group(group)
        db.session.commit()
        return 'success'
    else:
        return 'not logged'

# 取消群组关注
@app.route('/remove_attention_from_group/', methods = ['POST'])
def remove_attention_from_group():
    group_id = request.form['group_id']
    group = Group.query.get(group_id)
    if 'logged_in' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.remove_from_group(group)
        db.session.commit()
        return 'success'
    else:
        return 'not logged'

# 创建群组
@app.route('/create_group/', methods = ['POST'])
def create_group():
    group_name = request.form['group_name']
    if 'logged_in' in session:
        user_id = session['user_id']
        group = Group(group_name, user_id)
        db.session.add(group)
        db.session.commit()
        return 'success'
    else:
        return 'not logged'



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
        elif not user.check_password(pwd):
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
            print request.form['title']
            share = Share(url = request.form['url'],
                    title = request.form['title'],
                    explain = request.form['explain'],
                    timestamp = datetime.now())
            share.user_id = session['user_id']
            db.session.add(share)
            db.session.commit()
            print share.title
            resp['success'] = True 
        else:
            resp['success'] = False
            resp['errorCode'] = 1
    return json.dumps(resp)

