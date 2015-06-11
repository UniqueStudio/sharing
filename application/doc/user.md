#User文档

##模块：
---
###Login:
####用途
用户登陆
####重点接口
post：异步登陆
get：测试xsrf
login：post调用的异步登陆接口
####post/get方法参数
post：

- email:用户的email
- password:用户的密码

####结果
登陆成功：将用户的id, nickname, email 记录到session中,向客户端返回成功信息
登陆失败：抛出UserException


---
###Register
####用途
用户注册
####限制条件
email不重复
####重点接口
post：异步注册
register：post调用的注册接口
####post/get方法参数
post:

- email:用户的email
- password:用户的密码
- nickname:用户的用户名

####结果
注册成功：将用户存入数据库，返回成功信息
注册失败：抛出UserException


---
###Homepage
####用途
get个人主页信息
####限制条件
登陆中（session有id存在且id可查找出user）
####重点接口
get：异步get
get_homepage:获得个人信息接口
####post/get方法参数
get:

- 无

####返回结果
成功：返回个人详细信息
失败：抛出UserException


---
###ModifyMyInformation
####用途
修改个人信息
####限制条件
登陆
####重点接口
post:访问接口
modify_information：修改信息的异步方法接口
####post/get方法参数
post:

- phone_number:电话
- is_man:性别是否为男
- education:教育背景
- brief:简介

####返回结果
成功：将修改信息存入数据库，返回成功信息
失败：抛出UserException


---
###UploadImage
####用途
上传头像
####限制条件
登陆
####重点接口
get:测试的html
post:同步上传文件（暂时, 之后改为异步）
save:存储文件
####post/get方法参数
post:

- avatar:头像图像

####返回结果
成功：将头像信息存入用户数据库字段中,返回成功信息,图片存储在application/avatar
失败：返回相应信息


---
###InviteExist
####用途
邀请已注册成员入组
没有加入通知
####限制条件
邀请者需登陆， 这里并没有规定是否是管理员， 可依据需求修改
####重点接口
invite方法:邀请接口
####post/get方法参数
post:

- 被邀请者id
- 要求进入组的id

####返回结果
成功： 将邀请信息存入数据库，返回成功信息
失败： 返回失败信息


---
###InviteByEmail
####用途
已邮件形式邀请未注册的人，给出一个独特的url，里面附上数据库中具体邀请的id,
该url指向注册页面并注册时候在url参数上带上id，现在被没有做发送email的功能以及注册即可加入组的功能,
没有加入通知
####限制条件
邀请者需登陆， 这里并没有规定是否是管理员， 可依据需求修改
####重点接口
invite方法：邀请接口
####post/get方法参数
post:

- 被邀请者email
- 要求进入组的id
####返回结果
成功： 将邀请信息存入数据库，发送邮件（未完成），返回成功信息
失败： 返回失败信息


---
###AcceptInvite
####用途
接收组邀请（限于InviteExist邀请）
####限制条件
必须登陆，且登陆账号必须与受邀请人一致（多虑）
####重点接口
post:同步方法
####post/get方法参数
post:

- 邀请条目的id

####返回结果
成功：将用户加入邀请组， 返回成功信息
失败：抛出异常或返回失败信息


---
###Follow
####用途
follow某用户
####限制条件
需登陆
####重点接口
follow方法
####post/get方法参数
post:

- follow的用户的id

####返回结果
成功：在被follow与follow的用户上都保存信息， 返回成功信息
失败：返回失败信息


---
###Black
####用途
拉黑
####限制条件
需登陆
####重点接口
black
####post/get方法参数
post:

- 拉黑的用户的id

####返回结果
成功：在被black与black的用户上都保存信息， 返回成功信息
失败：返回失败信息


---
###CancleFollow
####用途
取消follow
####限制条件
需登陆，且关注了此人
####重点接口
cancle_follow
####post/get方法参数
post:

- 取消follow用户的id

####返回结果
成功：在被取消用户与取消用户的用户上都保存信息， 返回成功信息
失败：返回失败信息


---
###CancleBlack
####用途
取消拉黑
####限制条件
需登陆，且拉黑了此人
####重点接口
cancle_black
####post/get方法参数
post:

- 取消拉黑用户的id

####返回结果
成功：在被取消用户与取消用户的用户上都保存信息， 返回成功信息
失败：返回失败信息


---
###ApplyGroup
####用途
申请入组
####限制条件
需登陆, 且没有加入该组, 且之前没有申请过（在被拒绝之后申请记录抹去）
####重点接口
apply_group:申请方法
####post/get方法参数
post:

- 申请进入组的id

####返回结果
成功：在所申请的组的apply_users字段中加入用户信息， 返回成功信息
失败：返回失败信息

