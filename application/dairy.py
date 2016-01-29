# coding=utf8

import json
import datetime

import tornado.web
import pymongo
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

        @apiDescription 1.用UTC时间戳获取日报，该时间戳是某天的0点0分0妙，如2016年1月25日就是“1453680000”，目前最多3篇;
        2. 如果“action”为“all”则查询所有日报，时间增序排列

        @apiParam {String} [timestamp] 10位整数，
        @apiParam {String} [action] 目前只有“all”是合法参数

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
        action = self.get_body_argument("action", None)
        if action == "all":
            result = self._get_all_dairy(db)
        else:
            result = self._get_dairy(db, self.get_body_argument("timestamp"))
        self.write(json.dumps(result))

    def _parse_timestamp(self, timestamp):
        if len(timestamp) != 10 or timestamp != filter(lambda x: x in "0123456789", timestamp):
            raise BaseException("操作非法")
        return datetime.datetime.utcfromtimestamp(int(timestamp))

    def _get_dairy(self, db, timestamp):
        return self._format_result(db.dairy.find_one({"create_time": self._parse_timestamp(timestamp), "user_id": self.current_user["id"]}))

    def _get_all_dairy(self, db):
        return self._format_result(
            [x for x in db.dairy.find({"user_id": self.current_user["id"]}).sort([("create_time", pymongo.ASCENDING)])]
        )

    def _format_result(self, r):
        if r:
            if isinstance(r, list):
                r_set = set()
                map(lambda d: r_set.update(set(str(x) for x in d["contents"])), r)
                share_id_list = list(r_set)
            else:
                share_id_list = map(lambda x: str(x), r["contents"])
        else:
            share_id_list = []
        return {"message": "success", "share_id_list": share_id_list}
