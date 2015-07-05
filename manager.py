#encoding:utf-8
__author__ = 'bing'

import tornado.httpserver
import tornado.ioloop
import tornado.options

from application import Application


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(8887)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()
