#encoding:utf-8

from mongoengine import Document, connect
from mongoengine.fields import *

class Test(Document):
    name = ListField(StringField(required=True), default=list)


if __name__ == '__main__':
    connect('test')
    test = Test()
    test.name.append('test1')
    test.name.append('test2')
    test.name.append('test3')
    test.name.append('test4')
    test.name.append('test5')
    test.save()

    test_t = Test.objects().first()
    print test_t.name
