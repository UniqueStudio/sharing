# coding=utf8

import logging
import datetime

from pymongo import MongoClient


settings = {
    "debug": False,
}


def _get_mongo_client():
    return MongoClient("localhost")


class DairyCronTask(object):

    def __init__(self):
        self.client = _get_mongo_client()
        self.db = self.client["share"]

    def get_user_list(self):
        global settings
        filter_dict = {"email": "longchen@hustunique.com"} if settings["debug"] else {}
        user_list = self.db.user.find(filter_dict, {
            "password": 0,
            "register_time": 0,
            "avatar": 0,
            "phone_number": 0,
            "comments": 0,
            "followers": 0,
            "inviter": 0,
            "manager_groups": 0,
            "notify_content": 0,
        })
        return user_list

    def set_default_list(self, user, attr):
        if attr not in user:
            user[attr] = []

    def set_default_fields_value(self, user):
        fields = ["self_shares", "gratitude_shares", "following",
                  "black_users", "groups"]
        map(lambda x: self.set_default_list(user, x), fields)

    @staticmethod
    def get_today():
        return datetime.datetime.strptime(datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d"), "%Y-%m-%d")

    def get_dairy(self, user):
        self.set_default_fields_value(user)
        r = self.db.dairy.find_one({
            "user_id": user["_id"],
            "create_time": self.get_today()
        })
        if r:
            return None
        else:
            dairy_shr_history = set()
            map(lambda x: dairy_shr_history.update(x["contents"]), self.db.dairy.find({
                "user_id": user["_id"]
            }))
            dairy_exclude = dairy_shr_history.union(set(user["self_shares"]))
            dairy_pool = [shr for shr in self.db.share.find({}, {"passage": 0, "comments": 0, "title": 0, "url": 0})]
            dairy_pool = filter(lambda x: x["_id"] not in dairy_exclude and x["own_group"] in user["groups"], dairy_pool)
            dairy_pool.sort(key=lambda shr: len(shr["gratitude_users"]))
            if dairy_pool:
                dairy_pool.reverse()
                logging.debug(user)
                logging.debug(dairy_pool[:3])
                self.db.dairy.insert({
                    "user_id": user["_id"],
                    "create_time": self.get_today(),
                    "contents": [x["_id"] for x in dairy_pool[:3]]
                })
                return dairy_pool[:3]
            else:
                return None

    def run(self):
        map(lambda u: self.get_dairy(u), self.get_user_list())


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG, format="[%(name)s][%(levelname)s][%(asctime)s]: %(message)s")
    task = DairyCronTask()
    task.run()
