# coding=utf8

import json
import datetime

import tornado.web
from pymongo import MongoClient

from application.base import BaseHandler
from application.exception import BaseException


class DairyHandler(BaseHandler):

    @BaseHandler.sync_sandbox
    @tornado.web.authenticated
    def post(self):
        """
        @api {post} /dairy 获取日报
        @apiVersion 0.2.0
        @apiName GetDairy
        @apiGroup User

        @apiDescription 用UTC时间戳获取日报，该时间戳是某天的0点0分0妙，如2016年1月25日就是“1453680000”，目前最多3篇

        @apiParam {String} timestamp 10位整数，

        @apiSuccess {String[]} share_id_list 最多有3篇

        @apiSuccessExample Success-Response:
           HTTP/1.1 200 OK
           {
             "message": "success"
             "share_id_list": ["56a48d0f97fbdf11c5f0b686"]
           }
        """
        client = MongoClient()
        db = client["share"]
        timestamp = self.get_body_argument("timestamp")
        if len(timestamp) != 10 or timestamp != filter(lambda x: x in "0123456789", timestamp):
            raise BaseException("操作非法")
        print datetime.datetime.utcfromtimestamp(int(timestamp))
        r = db.dairy.find_one({"create_time": datetime.datetime.utcfromtimestamp(int(timestamp)), "user_id": self.current_user["id"]})
        if r:
            share_id_list = map(lambda x: str(x), r["contents"])
        else:
            share_id_list = []
        self.write(json.dumps({"message": "success", "share_id_list": share_id_list}))
