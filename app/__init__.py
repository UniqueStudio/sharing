#encoding: utf-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from config import mail_config
from oauth import oauth

app = Flask(__name__)
app.config.from_object('config')
app.config.update(mail_config)
# 注册Blueprint
app.register_blueprint(oauth.bp, url_prefix = '/oauth')

mail_abc = Mail(app)
db = SQLAlchemy(app)

import sys
reload(sys)
sys.setdefaultencoding('utf8')

from app import views, models, forms
