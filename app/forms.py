#encoding: utf-8
from flask_wtf import Form
from wtforms import TextField, BooleanField, PasswordField, validators
from wtforms.validators import DataRequired
from models import Group, User, Share, Comment

class RegisterForm(Form):
    name = TextField('Name', validators=[DataRequired()])
    email = TextField('E-mail', validators=[DataRequired()])
    password = PasswordField('New Password', [
        validators.Required(),
        validators.EqualTo('confirm', message = 'Passwords must match')
        ])
    confirm = PasswordField('Repeat Password')

class LoginForm(Form):
    email = TextField('E-mail', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Rememeber Me', default=False)

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    def validate(self):
        # 检测表单是否被提交
        if not Form.validate(self):
            return False

        user = User.query.filter_by(email = self.email.data).first()
        if user and user.check_password(self.password.data):
            return True
        else:
            return False

    def current_user(self):
        user = User.query.filter_by(email = self.email.data).first()
        return user.id
        
class CommentForm(Form):
    body = TextField('Comment', validators=[DataRequired()])


