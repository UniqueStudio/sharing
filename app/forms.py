#encoding: utf-8
from flask_wtf import Form
from wtforms import TextField, BooleanField, PasswordField, validators
from wtforms.validators import DataRequired
from models import Group, User, Share, Comment

class RegisterForm(Form):
    name = TextField('name', validators=[DataRequired()])
    email = TextField('email', validators=[DataRequired()])
    password = PasswordField('new password', [
        validators.Required(),
        validators.EqualTo('confirm', message = 'Passwords must match')
        ])
    confirm = PasswordField('repeat password')

class LoginForm(Form):
    email = TextField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    def validate(self):
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
    body = TextField('comment', validators=[DataRequired()])


