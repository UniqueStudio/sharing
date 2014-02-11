# encoding: utf-8
from flask_wtf import Form
from wtforms import TextField, BooleanField, PasswordField 
from wtforms.validators import DataRequired, Email, Length

ERROR_PASSWORD = u'The password is too long'
ERROR_NICKNAME = u'The nickname is too long'

MAX_PASSWORD = 16
MAX_NICKNAME = 40


class RegisterForm(Form):
    email_field = TextField('E-mail', validators=[DataRequired(), Email()])
    password_field = PasswordField('New Password',
            validators=[DataRequired(), Length(max=MAX_PASSWORD,
                message=ERROR_PASSWORD)])
    nickname_field = TextField('NickName', validators=[DataRequired(),
        Length(max=MAX_NICKNAME, message=ERROR_NICKNAME)])

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    @property
    def nickname(self):
        return self.nickname_field.data

    @property
    def email(self):
        return self.email_field.data

    @property
    def password(self):
        return self.password_field.data



class LoginForm(Form):
    email_field = TextField('E-mail', validators=[DataRequired(), Email()])
    password_field = PasswordField('Password',
            validators=[DataRequired(), Length(max=MAX_PASSWORD,
                message=ERROR_PASSWORD)])
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



class CommentForm(Form):
    body = TextField('Comment', validators=[DataRequired()])


class AddPwdForm(Form):
    password_field = PasswordField('New Password',
            validators=[DataRequired(), Length(max=MAX_PASSWORD,
                message=ERROR_PASSWORD)])

    @property
    def password(self):
        return self.password_field.data
