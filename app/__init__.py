#encoding: utf-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from config import mail_config

app = Flask(__name__)
app.config.from_object('config')
app.config.update(mail_config)
mail = Mail(app)
db = SQLAlchemy(app)

from app import views, models, forms, mail
