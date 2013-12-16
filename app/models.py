from app import db

class Group(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(20))
    users = db.relationship('User', lazy='dynamic')

    def __repr__(self):
        return '<Group %r>' % (self.title)

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20))
    email = db.Column(db.String(30))
    password = db.Column(db.String(30))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    shares = db.relationship('Share', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % (self.username)

class Share(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    link = db.Column(db.String(20))
    likes = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Share %r>' % (self.id)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(528))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    share_id = db.Column(db.Integer, db.ForeignKey('share.id'))

    def __repr__(self):
        return '<Comment %r>' % (self.id)
    
#tags = db.Table('tags',
#        db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
#        db.Column('post_id', db.Integer, db.ForeignKey('post.id')),
#        )
#
#class Tag(db.Model):
#    id = db.Column(db.Integer, primary_key = True)
#    title = db.Column(db.String(20))
#
#    def __repr__(self):
#        return '<Category %r>' % (self.title)
#
#class Post(db.Model):
#    id = db.Column(db.Integer, primary_key = True)
#    head = db.Column(db.String(50))
#    body = db.Column(db.String(2000))
#    timestamp = db.Column(db.DateTime)
#    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
#    db.relationship('Comment', backref='post', lazy='dynamic')
#    tags = db.relationship('Tag', secondary=tags,
#            backref=db.backref('posts', lazy='dynamic'))
#
#    def __repr__(self):
#        return '<Post %r>' % (self.head)

