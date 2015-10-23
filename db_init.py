# encoding=utf-8

import csv
import os
import hashlib

from application.models.user import User


def check_contain_chinese(check_str):
    for ch in check_str.decode('utf-8'):
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False


def main():
    m = hashlib.md5()
    m.update("hustunique")
    init_passwd = m.hexdigest()
    input_file = "/".join([os.path.dirname(os.path.realpath(__file__)), "application/data/data.csv"])
    with open(input_file, "r") as f:
        reader = csv.reader(f)
        users = []
        for r in reader:
            if check_contain_chinese(r[1]) or check_contain_chinese(r[2]):
                name = r[2] + r[1]
            else:
                name = r[1] + " " + r[2]
            users.append(User(email=r[0], nickname=name, password=init_passwd))
        User.objects.insert(users)

if __name__ == "__main__":
    main()
