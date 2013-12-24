#encoding:utf-8
from app import db
import md5

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
    # def __init__(self, name):
        # self.title = name

    def __repr__(self):
        return '<Group %r>' % (self.title)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(40))
    email = db.Column(db.String(150), unique = True)
    pwdhash = db.Column(db.String(32))
    shares = db.relationship('Share', lazy='dynamic')
    comments = db.relationship('Comment', lazy='dynamic')
    like_shares = db.relationship('Share', lazy='dynamic', secondary=user_likes)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password):
        self.pwdhash = md5.new(password).hexdigest()

    def check_password(self, password):
        return self.pwdhash == md5.new(password).hexdigest()
    
    def like(self, share):
        if not self.is_like(share):
            self.like_shares.append(share)
            return self
    
    def dislike(self, share):
        if self.is_like(share):
            self.like_shares.remove(share)
            return self

    def is_like(self, share):
        return share in self.like_shares.all()

    def __repr__(self):
        return '<User %r>' % (self.username)

class Share(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    url = db.Column(db.String(200))
    title = db.Column(db.String(180))
    explain = db.Column(db.String(350))
    likes = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    comments = db.relationship('Comment', lazy='dynamic')

    def __repr__(self):
        return '<Share id=%d url=%s>' % (self.id, self.url)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(528))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    share_id = db.Column(db.Integer, db.ForeignKey('share.id'))

    def __repr__(self):
        return '<Comment %r>' % (self.id)
    
