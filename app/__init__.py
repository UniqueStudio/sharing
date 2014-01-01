#encoding: utf-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from config import mail_config

app = Flask(__name__)
app.config.from_object('config')
app.config.update(mail_config)
mail_abc = Mail(app)
db = SQLAlchemy(app)

import sys
reload(sys)
sys.setdefaultencoding('utf8')

from app import views, models, forms
