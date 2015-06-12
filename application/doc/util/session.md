#Session功能

##主要模块：
---
###MemcacheSessionManager
####方法：
- save_session:以session_id（自己设置生成方法, 通过构造函数传入）为键， session存储数据为值存入数据库中
- create_new:建立一个新session
- load_session:以session_id加载session，如果没有返回新的

####说明:
session操作建立在Memcache基础上，且端口为11211。获得session之后操作方式与dict一致