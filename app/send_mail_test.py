#encoding: utf-8
from flask import Flask
from mail import GetURLFromURLQueue, SendMail
import time
import Queue

app = Flask(__name__)
queue = Queue.Queue(maxsize=-1)

queue.put('qiguo@hustunique.com')
queue.put('shengzhang@hustunique.com')
queue.put('767813944@qq.com')

with app.app_context():
    t1 = GetURLFromURLQueue(queue)
    t2 = SendMail(app)
    t3 = SendMail(app)
    t4 = SendMail(app)
    start = time.time()
    t1.start()
    t2.start()
    t3.start()
    t4.start()
        
print time.time() - start
