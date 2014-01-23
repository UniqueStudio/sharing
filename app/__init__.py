#encoding: utf-8
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from config import mail_config

# import Blueprint
from account import account
from share import share
from comment import comment

# import error
from error import OutputError

app = Flask(__name__)
app.config.from_object('config')
app.config.update(mail_config)



# 注册Blueprint
app.register_blueprint(account, url_prefix = '/account')
app.register_blueprint(share, url_prefix = '/share')
app.register_blueprint(comment, url_prefix = '/comment')



mail_abc = Mail(app)
db = SQLAlchemy(app)

import sys
reload(sys)
sys.setdefaultencoding('utf8')

from app import views, models, forms


@app.errorhandler(OutputError)
def handle_OutputError(error):
    import json

    result = {
            'status': False, 
            'msg': error.msg
            }
    return json.dumps(result)
