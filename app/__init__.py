#encoding: utf-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail

app = Flask(__name__)
mail = Mail(app)
app.config.from_object('config')
db = SQLAlchemy(app)

from app import views, models, forms
