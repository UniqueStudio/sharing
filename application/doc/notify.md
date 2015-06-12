#Notify文档
/application/notify.py


##模块:
---
###NotifyInfo:
####用途
获得通知信息
####限制条件
需登陆
####重点接口
show_notify_info
####post/get方法参数
post:

- 无

####结果
成功： 返回成功信息，获得通知信息, 用户中的通知信息清空
失败： 返回失败信息，说明原因

TODO:
重构长函数，建立方便添加新通知类型的机制
