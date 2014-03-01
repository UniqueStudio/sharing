#encoding: utf-8
from flask import Flask
# from flask.ext.mail import Mail
# from config import mail_config

# import db
from models import db

# import Blueprint
from account.controller import account
from share.controller import share
from comment.controller import comment
from extension.controller import extension
from collection.controller import collection

# import upload
from account.core import photos
from flaskext.uploads import configure_uploads

# import error
from error import OutputError

app = Flask(__name__)
app.config.from_object('config')

# configure uploadset
configure_uploads(app, photos)

# app.config.update(mail_config)

# 把数据库和应用相关联 
db.init_app(app)

# 注册Blueprint
app.register_blueprint(account, url_prefix = '/account')
app.register_blueprint(share, url_prefix = '/share')
app.register_blueprint(comment, url_prefix = '/comment')
app.register_blueprint(extension, url_prefix = '/extension')
app.register_blueprint(collection, url_prefix = '/collection')

# mail_abc = Mail(app)



import sys
reload(sys)
sys.setdefaultencoding('utf8')

# from app import views, models, forms


@app.errorhandler(OutputError)
def handle_OutputError(error):
    import json

    result = {
            'status': False, 
            'msg': error.msg
            }
    return json.dumps(result)
