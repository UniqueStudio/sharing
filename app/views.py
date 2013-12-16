from flask import render_template, redirect, url_for, session,\
        request, flash, abort
from app import app, db
from models import Group, User, Share, Comment
from datetime import datetime


# users login and logout
@app.route('/login', methods = ['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        login_name = request.form['login']
        password = request.form['password']
         
        if User.query.filter_by(username=login_name).count() == 0:
            error = "invalid name"
            return redirect(url_for('login', error = error))
        user = User.query.filter_by(username=login_name).first()
        if user.password != password:
            error = "invalid password"
            return redirect(url_for('login', error = error))
        else:
            session['logged_in'] = True
        return redirect(url_for('index'))

    return render_template("login.html",
            title = 'login',
            error = error)

@app.route('/logout')
def logout():
    session.pop('logged_in',None)
    flash("you were logged out")
    return redirect(url_for('index'))

@app.route('/register', methods = ['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        user = User(username = request.form['username'],
                email = request.form['email'],
                password = request.form['password'])
        db.session.add(user)
        db.session.commit()
        session['logged_in'] = True
        return redirect(url_for('index'))

    return render_template("register.html",
            title = 'register')

@app.route('/')
@app.route('/index')
def index():
    shares = [
            {
                'link': 'http://www.baidu.com',
                'likes': '0'
            },
            {
                'link': 'http://www.baidu.com',
                'likes': '0'
            }
            ]
    return render_template("index.html",
            shares = shares,
            title = 'home')

@app.route('/reading/<int:id>')
def reading(id):
    shares = [
            {
                'link': 'http://www.baidu.com',
                'likes': '0'
            },
            {
                'link': 'http://blog.miguelgrinberg.com',
                'likes': '0'
            }
            ]
    share = shares[0]
    return render_template("reading.html",
            share = share,
            shares = shares,
            title = 'home')


