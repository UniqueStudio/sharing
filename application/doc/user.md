#User文档

##模块：
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

####返回结果
登陆成功：将用户的id, nickname, email 记录到session中
登陆失败：抛出UserException
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

####返回结果
注册成功：无返回
注册失败：抛出UserException
###Homepage
####用途
get个人主页信息
####限制条件
登陆中（session有id存在且id可查找出user）
####重点接口
get：异步get
get_homepage:get调用的异步方法
####post/get方法参数
get:

无
####返回结果
成功：返回个人详细信息
失败：抛出UserException
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
成功：返回'modify_information'(暂时)
失败：抛出UserException
###UploadImage
####用途
上传头像
####限制条件
登陆
####重点接口
get:测试的html
post:同步上传文件（暂时）
save:存储文件
####post/get方法参数
post:

- avatar:头像图像

####返回结果
成功：控制台输出'success'(暂时)，返回'finish'，图片存储在application/avatar
失败：返回'finish'
###OperateMyShare
####用途
操作自己的share，提供删除，添加，感谢功能
####限制条件
登陆
删除需要存在share且是自己添加的
添加需要不存在share
感谢需要存在share
####重点接口
post:异步访问接口，根据动作分发方法
delete_share:删除share（未完成）
add_share:添加share（未完成）
gratitude：感谢share（未完成）
####post/get方法参数
post:

- operate:
    - delete:
        - share_id:删除的share的id
        - group_id:删除的share所属组的id

####返回结果
未完成
###OperateMyGroup
####用途
对自己组进行操作(未完成)
####限制条件
####重点接口
####post/get方法参数
####返回结果
###Invite
邀请（未完成）
####用途
####限制条件
####重点接口
####post/get方法参数
####返回结果
###OperateException
操作异常
####用途
显示操作异常
####限制条件
一个描述字符串参数
