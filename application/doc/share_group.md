#ShareGroup文档
/application/share_group.py

##模块:
---
###CreateGroup:
####用途
创建组,组名需唯一
####限制条件
需登陆
####重点接口
create_group
####post/get方法参数
post:

- 组名

####结果
成功： 返回成功信息，数据库中创建该组，并给予创建者管理员权限
失败： 返回失败信息，说明原因

---
###GroupInfo:
####用途
查询组的基本信息(组名， 创建者信息)
####限制条件
无
####重点接口
show_info
####post/get方法参数
get:

- 要查询组的id

####结果
成功：返回组的信息
失败：返回失败信息

---
###GroupShare:
####用途
列出该组所有的share
####限制条件
需登陆，而且该登陆用户需是该组成员
####重点接口
get_shares
####post/get方法参数
get:

- group_id

####结果
成功：返回share列表，以title和id作为一个元组
失败：返回失败信息

---
###GroupUser:
####用途
返回该组所有用户的信息（nickname和id的元组）
####限制条件
需登陆，而且该登陆用户需是该组成员
####重点接口
get_users
####post/get方法参数
get:

- group_id

####结果
成功：返回user列表，以nickname和id作为一个元组
失败：返回失败信息

---
###ChangeAdmin:
####用途
更换管理员
####限制条件
当前登陆用户为该组管理员
####重点接口
change_admin
####post/get方法参数
post:

- group_id
- user_id:继承用户id

####结果
成功：返回成功信息并在数据库中更改group的create_user, create_time, 将原来管理员的manage_groups中删除该组，
     在现在user中的manage_groups中添加该组
失败：返回失败信息

---
###ApplyUser:
####用途
查看申请用户信息
####限制条件
管理员登陆
####重点接口
show_apply_users
####post/get方法参数
get:

- group_id

####结果
成功：返回用户信息
失败：返回失败信息

---
###AcceptApply:
####用途
接受申请
####限制条件
管理员权限登陆，该用户申请了入组
####重点接口
accept_apply
####post/get方法参数
post:

- group_id
- apply_user_id

####结果
成功:返回成功信息， 将user加入该组，并将user从申请名单中删除
失败：返回失败信息

---
###RejectApply:
####用途
拒绝申请
####限制条件
管理员权限登陆
####重点接口
reject_apply
####post/get方法参数:
post:

- group_id
- apply_user_id

####结果
成功：返回成功信息，将user从申请列表中删除
失败：返回失败信息

TODO:
1. 获得所有组列表
2. 提供搜索组的接口
