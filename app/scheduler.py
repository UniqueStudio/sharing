#!/usr/bin/python
#coding: utf8
import time
import datetime
import thread
from flask import render_template 
from flask_mail import Mail
from flask_mail import Message
from decorates import async
from app import app
import config

mail = Mail()

def create_messsage(subject='', recipients=[], sender=None, nickname=None,
        shares=None):
    msg = Message(subject, recipients=recipients, sender=sender)
    msg.html = render_template('mail_template.html', nickname=nickname, shares=shares,
            url=config.TEST_URL)
    return msg


def send_mail():
    # 休眠延时, 每日固定时间发送
    while True:
        time.sleep(cal_delay(0, 0, 0))
        print 'send mail...'
        with app.app_context():
            from models import User, Share
            subject = unicode('【Share】每日精彩分享')
#users = User.query.all()
# shares = Share.query.order_by(Share.likes).paginate(1, 5, False)
            cur_time = datetime.datetime.utcnow()
            shares = Share.query.filter(Share.timestamp > cur_time - datetime.timedelta(days=1)).all()
            print shares
            if shares != []:
# for user in users:
#                print 'ready to send mail'
#                msg = create_messsage(subject, recipients=[user.email], nickname=user.nickname, shares=shares)
#               conn.send(msg)
# print 'mail has been sent'
                msg = create_messsage(subject, recipients=['freshmembers@hustunique.com'], nickname='',  shares=shares)
#                msg = create_messsage(subject, recipients=['qiguo@hustunique.com'], nickname='',  shares=shares)
                mail.send(msg)


def send():
    thread.start_new_thread(send_mail, ())



def cal_delay(hour, minute, second):
    '''
    计算到目标时间的延时
    参数指定目标时间的时分秒
    '''
    # 获取当前时间
    today = datetime.datetime.utcnow()
    increament = datetime.timedelta(1, 0, 0)
    # 获取第二日的目标时间
    # 固定在每日的晚上七点
    fixday = datetime.datetime(today.year, today.month, today.day, 
            hour, minute, second)
    # 取差，判断今天是否执行过
    delta = fixday + increament - today
    # 今天已经执行过, 那么根据实际差值计算休眠的秒数
    # 如果没有执行过，那么计算离当天执行所差的秒数
    if delta.days < 1:
        delay = delta.total_seconds()
    else:
        delta = fixday - today
        delay = delta.total_seconds()
    return delay
