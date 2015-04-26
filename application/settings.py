# encoding:utf-8
__author__ = 'bing'

import pymongo

db = pymongo.Connection("localhost", 27017)['share']

dbs = {
    'default' : db,
}

