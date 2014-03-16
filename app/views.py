#coding: utf8
from flask import url_for, make_response, redirect

from app import app
from app.filters import check_logged
from app import account
from app import share

@app.route('/')
def index():
    if check_logged() is False:
        return make_response(redirect(url_for('account.login')))
    else:
        return make_response(redirect(url_for('share.list')))
