# encoding: utf-8
from flask_wtf import Form
from wtforms import TextField, BooleanField, PasswordField, validators
from wtforms.validators import DataRequired
from models import Group, User, Share, Comment
import re


class RegisterForm(Form):
    email_field = TextField('E-mail', validators=[DataRequired()])
    password_field = PasswordField('New Password', [
        validators.Required(),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
    name_field = TextField('Name', validators=[DataRequired()])
    confirm_field = PasswordField('Repeat Password')

    @property
    def nickname(self):
        return self.name_field.data

    @property
    def email(self):
        return self.email_field.data

    @property
    def password(self):
        return self.password_field.data


    # def validate(self):
    #     if not Form.validate(self):
    #         return False

    #     if len(self.email.data) < 7:
    #         self.email.errors.append("unvalid email")
    #         return False
    #     elif re.match(
    #             "^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$",
    #             self.email.data) == None:
    #         self.email.errors.append("unvalid email")
    #         return False

    #     # email check duplicate
    #     user = User.query.filter_by(email=self.email.data).first()
    #     if user:
    #         self.email.errors.append("this email had been registered")
    #         return False

    #     if len(self.password.data) < 6:
    #         self.password.errors.append("password too short")
    #         return False

    # return True


class LoginForm(Form):
    email_field = TextField('E-mail', validators=[DataRequired()])
    password_field = PasswordField('Password', validators=[DataRequired()])
    remember_me_field = BooleanField('Rememeber Me', default=True)

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    @property
    def email(self):
        return self.email_field.data

    @property
    def password(self):
        return self.password_field.data

    @property
    def remember_me(self):
        return self.remember_me_field.data


    # def validate(self):
    # 检测表单是否被提交
    #     if not Form.validate(self):
    #         return False

    #     user = User.query.filter_by(email=self.email.data).first()
    #     if user and user.check_password(self.password.data):
    #         return True
    #     else:
    #         return False

    # def current_user(self):
    #     user = User.query.filter_by(email=self.email.data).first()
    #     return user.id


class CommentForm(Form):
    body = TextField('Comment', validators=[DataRequired()])
