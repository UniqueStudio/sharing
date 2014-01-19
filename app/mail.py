#encoding: utf-8
import threading
from flask_mail import Mail
from flask_mail import Message
from Queue import Queue
from flask import Flask, copy_current_request_context
from config import mail_config
import time

condition = threading.Condition()

url = None

# producer
class GetURLFromURLQueue(threading.Thread):
    def __init__(self, urls):
        super(GetURLFromURLQueue, self).__init__()
        self.urls = urls
        assert isinstance(self.urls, Queue)
    def run(self):
        global url
        if condition.acquire():
            while self.urls.empty() is not True:
                if url is None:
                    url = self.urls.get()
                    print '%s has got url' % self.name
                    condition.notify()
                condition.wait()


# consumer
class SendMail(threading.Thread):
    def __init__(self, app):
        super(SendMail, self).__init__()
        self.mail = Mail(app)
    def run(self):
        global url
        if condition.acquire():
            while True:
                if url is not None:
                    self.msg = Message('Hello', sender='uniqueguoqi@gmail.com', 
                            recipients=list(url))
                    self.msg.body = "nihaoa"
                    condition.notify()
                    print 'sending...'
                    self.mail.send(self.msg)
                    print 'send success'
                condition.wait()


def send(app):
    queue = Queue(maxsize=-1)
    queue.put('qiguo@hustunique.com')
    queue.put('shengzhang@hustunique.com')
    queue.put('767813944@qq.com')

    t1 = GetURLFromURLQueue(queue)
    t2 = SendMail(app)
    # t3 = SendMail(app)
    # t4 = SendMail(app)

    start = time.time()

    t1.start()
    t2.start()
    # t3.start()
    # t4.start()

    t1.join()
    t2.join()
    # t3.join()
    # t4.join()
    
    print time.time() - start

app = Flask(__name__)
app.config.update(mail_config)
with app.app_context():
    send(app)
