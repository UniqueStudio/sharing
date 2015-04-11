#Share文档
##数据库设置
###用户（User）
####不能为空
- ID——ObjectId
- 邮箱——字符串
- 密码——字符串
- 姓名——字符串
- 注册时间——日期
- 头像（从相册中选择）——字符串（存本地）
####可以为空
- 手机号——字符串
- 性别——字符串
- 教育信息——字符串
- 个人简介（限制长度不超过300个字节）——字符串
- 邀请人（内嵌）——UserObjectId
- Share列表（内嵌列表）——ShareObjectId数组
- 感谢的Share列表（内嵌列表）——ShareObjectId数组
- 评论列表（内嵌列表）——CommentObjectId数组
- 联系方式（如关联的QQ，微博等）——待定，暂时未加入
- 屏蔽用户（内嵌列表）——UserObjectId数组
- 特别关注（内嵌列表）——UserObjectId数组
- 所属组别（内嵌列表）——GroupObjectId数组
- 所管理的组（内嵌列表）—— GroupObjectId数组

###组别（Group）
####不能为空
- ID——ObjectId
- 组名——字符串
- 创建者（内嵌）——UserObjectId
- 管理员（内嵌列表）——UserObjectId数组
- 创建时间——日期
####可以为空
- Share列表（内嵌列表）——ShareObjectId数组
- 组成员（内嵌列表）——UserObjectId数组

###Share
####不能为空
- ID——ObjectId
- Share名——字符串
- Share描述——字符串
- URL——字符串
- 分享时间——日期
- 感谢数——数值
####可以为空
- 感谢成员（内嵌列表）——UserObjectId数组
- 评论（内嵌列表）——CommentObjectId数组

###评论
####不能为空
- ID——ObjectId
- 所属用户（内嵌）——UserObjectId数组
- 内容——字符串
- 创建时间——日期
- Share（内嵌）——ShareObjectId

