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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def __init__(self, name, user_id):
        self.title = name
        self.user_id = user_id

    def __repr__(self):
        return '<Group %r>' % (self.title)

    def is_attentioned(self, user):
        return user in self.users.all()


class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(40))
    email = db.Column(db.String(150), unique = True)
    pwdhash = db.Column(db.String(32))
    shares = db.relationship('Share', lazy='dynamic', backref='author')
    comments = db.relationship('Comment', lazy='dynamic', backref='publisher')
    like_shares = db.relationship('Share', lazy='dynamic', secondary=user_likes)
    groups = db.relationship('Group', lazy='dynamic', backref=db.backref('users', lazy='dynamic'),  secondary=group_users)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)
    def __repr__(self):
        return '<User %r>' % (self.username)

    def set_password(self, password):
        self.pwdhash = md5.new(password).hexdigest()

    def check_password(self, password):
        return self.pwdhash == md5.new(password).hexdigest()
    
    # likes
    def like(self, share):
        if not self.is_like(share):
            self.like_shares.append(share)
            share.likes += 1
    
    def dislike(self, share):
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
    
