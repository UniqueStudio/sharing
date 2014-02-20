#encoding:utf-8
from flask.ext.sqlalchemy import SQLAlchemy
from datetime import datetime
import md5

db = SQLAlchemy()

group_users = db.Table('group_users',
            db.Column('group_id', db.Integer, db.ForeignKey('group.id')),
            db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
        )

user_likes = db.Table('user_likes',
            db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
            db.Column('share_id', db.Integer, db.ForeignKey('share.id')),
        )


class Group(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(40), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    creator = db.relationship('User', lazy='select')
    def __init__(self, name, user_id):
        self.title = name
        self.user_id = user_id

    def __repr__(self):
        return '<Group %r>' % (self.title)

    def is_attentioned(self, user):
        return user in self.users.all()


class User(db.Model):
    id = db.Column(db.Integer, primary_key = True, nullable = False)
    email = db.Column(db.String(128), unique = True, nullable = False)
    pwdhash = db.Column(db.String(32), nullable = False)
    nickname = db.Column(db.String(40), nullable = False)
    image = db.Column(db.String(1024))

    shares = db.relationship('Share', lazy='dynamic',
            backref=db.backref('author', lazy='select'))
    comments = db.relationship('Comment', lazy='dynamic',
            backref=db.backref('author', lazy='select'))
    like_shares = db.relationship('Share', lazy='dynamic', secondary=user_likes)
    groups = db.relationship('Group', lazy='dynamic', backref=db.backref('users', lazy='dynamic'),  secondary=group_users)

    def __init__(self, email, password, nickname, image = None):
        self.email = email
        self.set_password(password)
        self.nickname = nickname
        self.image = image

    def __repr__(self):
        return '<User %d: %s\nNickName: %s>' % (self.id, self.email, self.nickname)

    def set_password(self, password):
        self.pwdhash = md5.new(password).hexdigest()

    def check_password(self, password):
        return self.pwdhash == md5.new(password).hexdigest()

    @classmethod
    def is_exist(cls, email):
        return cls.query.filter(User.email == email).first()
    
    # likes
    def like(self, share_id):
        share = Share.get(share_id)
        if not self.is_like(share):
            self.like_shares.append(share)
            share.likes += 1
    
    def dislike(self, share_id):
        share = Share.get(share_id)
        if self.is_like(share):
            self.like_shares.remove(share)
            share.likes -= 1

    def is_like(self, share):
        return share in self.like_shares.all()

    # group
    def is_in_the_group(self, group):
        return group in self.groups.all()
    
    def add_to_group(self, group):
        if not self.is_in_the_group(group):
            self.groups.append(group)

    def remove_from_group(self, group):
        if self.is_in_the_group(group):
            self.groups.remove(group)

    def avatar(self, size):
        return 'http://www.gravatar.com/avatar/' + md5.new(self.email).hexdigest() + '?d=mm&s=' + str(size)

    def get_group_first_id(self):
        group = self.groups.first()
        if group is None:
            return None
        return group.id


class Share(db.Model):
    id = db.Column(db.Integer, primary_key = True, nullable = False)
    title = db.Column(db.String(255), nullable = False)
    explain = db.Column(db.String(1024), nullable = False)
    url = db.Column(db.String(1024), nullable = False)
    likes = db.Column(db.Integer, default=0, nullable = False)
    timestamp = db.Column(db.DateTime, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)

    comments = db.relationship('Comment', lazy='dynamic')

    def __init__(self, title, explain, url, user_id):
        self.title = title
        self.explain = explain
        self.url = url
        self.user_id = user_id
        self.timestamp = datetime.now()


    @property
    def comments_num(self):
        return len(self.comments.all())


    def previous(self):
        shares = Share.query.all();
        try:
            index = shares.index(self)
        except ValueError:
            return None
        return shares.pop(index - 1)


    def after(self):
        shares = Share.query.all()
        try:
            index = shares.index(self)
        except ValueError:
            return None
        return shares.pop(index + 1)



class Comment(db.Model):
    id = db.Column(db.Integer, primary_key = True, nullable = False)
    body = db.Column(db.String(1024), nullable = False)
    timestamp = db.Column(db.DateTime, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    share_id = db.Column(db.Integer, db.ForeignKey('share.id'), nullable = False)

    def __init__(self, body, user_id, share_id):
        self.body = body
        self.user_id = user_id
        self.share_id = share_id
        self.timestamp = datetime.now()

    def __repr__(self):
        return '<Comment %r: %s\nAuthored by %s>' % (self.id, self.body, self.author)

    def get_author(self):
        self.author = User.query.get(self.user_id)        

#将comment的body以及share的explain字段长度改为1024 by@Yang
    
