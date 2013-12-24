#encoding:utf-8
from flask import render_template, redirect, url_for, session,\
        request, flash, abort, make_response
from app import app, db
from models import Group, User, Share, Comment
from forms import RegisterForm, LoginForm, CommentForm
from datetime import datetime
import json




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

    return render_template("login.html",
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

    return render_template("login.html",
            title = 'login',
            login_form = login_form,
            register_form = register_form,
            error = error)

@app.route('/')
@app.route('/index')
def index():
    
    if 'logged_in' in  session:
        pass
    else:
        return redirect(url_for('login'))

    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        if user_id:
            user = User.query.get(user_id)

    shares = Share.query.order_by(Share.timestamp).all()

    return render_template("index.html",
            shares = shares,
            current_user = user,
            title = 'home')

@app.route('/index_hot')
def index_hot():
    
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

    return render_template("index.html",
            shares = shares,
            current_user = user,
            title = 'home')

@app.route('/profile')
def profile():
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        shares = Share.query.filter_by(user_id = user_id).order_by(Share.timestamp)
    else:
        return redirect(url_for('login'))

    return render_template("profile.html",
            shares = shares,
            current_user = user,
            title = 'profile')

@app.route('/likes', methods = ['GET', 'POST'])
def likes():
    share_id = request.form['share_id']
    share = Share.query.get(share_id)
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        like = user.like(share)
        db.session.add(like)
        db.session.commit()
        return "success"
    else:
        return redirect(url_for('login'))

@app.route('/dislikes', methods = ['GET', 'POST'])
def dislikes():
    share_id = request.form['share_id']
    share = Share.query.get(share_id)
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        dislike = user.dislike(share)
        db.session.add(dislike)
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

@app.route('/add_comment', methods = ['GET', 'POST'])
def add_comment():
    c = Comment(body = request.form['comment_body'],
            share_id = request.form['share_id'],
            user_id = session['user_id'])
    db.session.add(c)
    db.session.commit()
    return 'succ'

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

