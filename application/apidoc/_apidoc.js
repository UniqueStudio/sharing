/**
 * @apiDefine login Login to get permission.
 * @apiVersion 0.1.0
 */

/**
 * @apiDefine admin To be the admin of this group.
 * @apiVersion 0.1.0
 */

/**
 * @apiDefine member To be member of this group
 * @apiVersion 0.1.0
 */

/**
 * @apiDefine SuccessMsg
 * @apiVersion 0.1.0
 * @apiSuccessExample Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success"
 *     }
 */

/**
 * @apiDefine GroupNotExistError
 * @apiVersion 0.1.0
 * @apiError GroupNotFound Can not find the group.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "failure",
 *       "reason": "该组不存在"
 *     }
 */

/**
 * @apiDefine UserNotExistError
 * @apiVersion 0.1.0
 * @apiError UserNotFound Can not find the user.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "failure",
 *       "reason": "Illegal uid"
 *     }
 */

/**
 * @apiDefine RequestError
 * @apiVersion 0.1.3
 * @apiError Bad Request.
 * @apiErrorExample Bad request:
 *     HTTP/1.1 400 Bad request
 */

/**
 * @apiDefine NotLoginError
 * @apiVersion 0.1.0
 * @apiError NotLogin  Users must login to invoke this api.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 */

/**
 * @apiDefine ForbiddenError
 * @apiVersion 0.1.2
 * @apiError Forbidden No permission.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 */

/**
 * @apiDefine OtherError
 * @apiVersion 0.1.0
 * @apiError SomeErrorInDetail Errors in detail.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "failure",
 *       "reason": String
 *     }
 */

//History

/**
 * @api {delete} /comment 删除评论
 * @apiVersion 0.1.0
 * @apiName DeleteComment
 * @apiGroup Comment
 * @apiPermission login
 *
 * @apiDescription 通过comment_id删除评论.
 *
 * @apiParam {String} comment_id Id of comment.
 *
 * @apiUse SuccessMsg
 *
 * @apiUse NotLoginError
 * @apiUse OtherError
 */

/**
 * @api {post} /comment 发布评论
 * @apiVersion 0.1.0
 * @apiName PostComment
 * @apiGroup Comment
 * @apiPermission login
 * 
 * @apiDescription 只能对组内的share发表评论.
 *
 * @apiParam {String} share_id Id of share..
 * @apiParam {String} content Content of comment.
 *
 * @apiUse SuccessMsg
 *
 * @apiUse NotLoginError
 * @apiUse OtherError
 */

/**
 @api {get} /comment?share_id=:share_id 获取评论
 @apiVersion 0.1.0
 @apiName GetComment
 @apiGroup Comment
 @apiPermission login

 @apiDescription 根据share_id获取组内某条share的评论.

 @apiParam {String} share_id Id of share in group.

 @apiSuccess {Object[]} comments Comments of share.
 @apiSuccess {String} comments.id Id of comment.
 @apiSuccess {String} comments.content Content of comment.
 @apiSuccess {String} comments.time Time of comment.
 @apiSuccess {String} comments.nickname Nickname of user who made this comment.
 @apiSuccess {String} comments.avatar Avatar of user who made this comment.

 @apiUse NotLoginError
 @apiUse OtherError
 */

/**
@api {get} /group/shares?group_id=:group_id 获取组内的share
@apiVersion 0.1.0
@apiName GetGroupShare
@apiGroup ShareGroup
@apiPermission member

@apiDescription 根据group_id获取组内share.

@apiParam {String} group_id The id of group.

@apiSuccess {Object[]} shares Shares in the group.
@apiSuccess {String} shares.title The title of shares.
@apiSuccess {String} shares.id The id of shares.
@apiSuccess {String} shares.share_time Time when share first made.
@apiSuccess {Number} shares.comment_sum The sum of comments.
@apiSuccess {Object} shares.origin First author of this share.
@apiSuccess {String} shares.origin.nickname Name of first author.
@apiSuccess {String} shares.origin.id Id of first author.
@apiSuccess {String} shares.origin.avatar Avatar of first author.
@apiSuccess {Object[]} shares.origin.others The rest of user who shared it.
@apiSuccess {String} shares.origin.others.id Id of user.
@apiSuccess {String} shares.origin.others.nickname Name of user.

@apiUse GroupNotExistError
@apiUse NotLoginError
*/

/**
@api {post} /share/forward 投递inbox_share（转发）
@apiVersion 0.1.1
@apiName ForwardInboxShare
@apiGroup InboxShare
@apiPermission login

@apiDescription 与"投递share（转发）"几乎相同，差别在于参数groups为空数组
 具体参数查看"投递share（转发）"
*/

/**
@api {get} /group/info?group_id=:group_id 查询组信息，包括成员
@apiVersion 0.1.1
@apiName GetGroupInfo
@apiGroup ShareGroup
@apiPermission member

@apiDescription 根据group_id来搜索group信息

@apiParam {String} group_id the id of group.

@apiSuccess {String} group_name The name of group.
@apiSuccess {String} group_id The id of group.
@apiSuccess {String} create_time The time of group created.
@apiSuccess {Object} admin Admin of the group.
@apiSuccess {String} admin.name The name of admin.
@apiSuccess {String} admin.id The id of admin.
@apiSuccess {Object[]} users Users in the group.
@apiSuccess {String} users.name The name of users.
@apiSuccess {String} users.id The id of users.

@apiUse GroupNotExistError
*/

/**
@api {get} /homepage[?uid=:uid] 个人主页
@apiVersion 0.1.0
@apiName Homepage
@apiGroup User
@apiPermission login

@apiDescription 查看个人主页内容，包括分享的share.
如果加上可选的uid，则可以看到这个uid对应用户的信息，
其同组的share可见，否则不可见.
带optional的返回字段仅自己可见.

@apiParam {String} [uid] User id.

@apiSuccess {String} nickname Nickname of user.
@apiSuccess {String} id Id of user.
@apiSuccess {String} avatar Avatar of user.
@apiSuccess {Boolean} is_man Gender of user.
@apiSuccess {String} brief Self description of user.
@apiSuccess {String} register_time Register time of user.
@apiSuccess {Object[]} groups Groups of user.
@apiSuccess {String} groups.id Id of groups.
@apiSuccess {String} groups.name Name of groups.
@apiSuccess {Object[]} shares Shares of user.
@apiSuccess {String} shares.id Id of shares.
@apiSuccess {String} shares.title Title of shares.
@apiSuccess {String} shares.group Group of shares.
@apiSuccess {String} shares.share_time Time shared.
@apiSuccess {String} [gratitude_shares_sum] The sum of gratitude received.
@apiSuccess {String} [comment_sum] The sum of comments made before.
@apiSuccess {String} [black_users_sum] The sum of user in blacklist.
@apiSuccess {String} [followers_sum] The sum of followers.
@apiSuccess {String} [following_sum] The sum of following.

@apiUse NotLoginError
*/

/**
 @api {post} /group 新建一个share组
 @apiVersion 0.1.0
 @apiName CreateGroup
 @apiGroup ShareGroup
 @apiPermission login

 @apiDescription 首先检查是否有相同名字的组，如果没有，则直接创建该组，
 执行此操作的人自动成为管理员。否则报错。

 @apiParam {String} name     the name of group to be created.

 @apiUse MessageSuccess

 @apiError GroupExist The group exists.
 @apiErrorExample Response:
 HTTP/1.1 200 OK
 {
   "message": "failure",
   "reason": "该组已存在"
 }
 */

/**
 @api {get} /group?group_name=:group_name 搜索share组
 @apiVersion 0.1.0
 @apiName GetGroup
 @apiGroup ShareGroup
 @apiPermission login

 @apiDescription 根据name来搜索group信息.

 @apiParam {String} group_name The name of group.

 @apiSuccess {String} group_name The name of group.
 @apiSuccess {String} group_id The id of group.
 @apiSuccess {String} create_time The time of group created.

 @apiUse GroupNotExistError
 */

/**
 @api {get} /group/all 获取用户所在的所有组
 @apiVersion 0.1.1
 @apiName GetAllGroup
 @apiGroup ShareGroup
 @apiPermission login

 @apiSuccess {Object[]} groups
 @apiSuccess {String} group_name The name of group.
 @apiSuccess {String} group_id The id of group.

 @apiSuccessExample {json} Success-Example
 HTTP/1.1 200 OK
 {
     "groups": [
         {
             "group_id": group.id,
             "group_name": group.name,
             "group_intro": group.intro
         }
     ]
 }
 */

/**
 @api {get} /group/shares?group_id=:group_id 获取组内的share
 @apiVersion 0.1.1
 @apiName GetGroupShare
 @apiGroup ShareGroup
 @apiPermission member

 @apiDescription 根据group_id获取组内share.

 @apiParam {String} group_id The id of group.

 @apiSuccess {Object[]} shares Shares in the group.
 @apiSuccess {String} shares.title The title of shares.
 @apiSuccess {String} shares.intro Introduction("" if not exists).
 @apiSuccess {String} shares.id The id of shares.
 @apiSuccess {String} shares.share_time Time when share first made.
 @apiSuccess {Number} shares.comment_sum The sum of comments.
 @apiSuccess {Object} shares.origin First author of this share.
 @apiSuccess {String} shares.origin.nickname Name of first author.
 @apiSuccess {String} shares.origin.id Id of first author.
 @apiSuccess {String} shares.origin.avatar Avatar of first author.
 @apiSuccess {Object[]} shares.origin.others The rest of user who shared it.
 @apiSuccess {String} shares.origin.others.id Id of user.
 @apiSuccess {String} shares.origin.others.nickname Name of user.

 @apiUse GroupNotExistError
 @apiUse NotLoginError
 */

/**
 @api {get} /homepage[?uid=:uid] 个人主页
 @apiVersion 0.1.2
 @apiName Homepage
 @apiGroup User
 @apiPermission login

 @apiDescription 查看个人主页内容，包括分享的share.
 如果加上可选的uid，则可以看到这个uid对应用户的信息，
 其同组的share可见，否则不可见.
 带optional的返回字段仅自己可见.

 @apiParam {String} [uid] User id.

 @apiSuccess {String} nickname Nickname of user.
 @apiSuccess {String} id Id of user.
 @apiSuccess {String} avatar Avatar of user.
 @apiSuccess {Boolean} is_man Gender of user.
 @apiSuccess {String} brief Self description of user.
 @apiSuccess {String} register_time Register time of user.
 @apiSuccess {Object[]} groups Groups of user.
 @apiSuccess {String} groups.id Id of groups.
 @apiSuccess {String} groups.name Name of groups.
 @apiSuccess {Object[]} shares Shares of user.
 @apiSuccess {String} shares.id Id of shares.
 @apiSuccess {String} shares.title Title of shares.
 @apiSuccess {String} shares.group Group of shares.
 @apiSuccess {String} shares.share_time Time shared.
 @apiSuccess {String} gratitude_shares_sum The sum of gratitude received.
 @apiSuccess {String} [comment_sum] The sum of comments made before.
 @apiSuccess {String} [black_users_sum] The sum of user in blacklist.
 @apiSuccess {String} [followers_sum] The sum of followers.
 @apiSuccess {String} [following_sum] The sum of following.


 @apiUse UserNotExistError
 @apiUse NotLoginError
 */

/**
 @api {get} /group/info?group_id=:group_id 查询组信息，包括成员
 @apiVersion 0.1.2
 @apiName GetGroupInfo
 @apiGroup ShareGroup
 @apiPermission member

 @apiDescription 根据group_id来搜索group信息

 @apiParam {String} group_id the id of group.

 @apiSuccess {String} group_name The name of group.
 @apiSuccess {String} group_id The id of group.
 @apiSuccess {String} group_intro Group.intro
 @apiSuccess {String} create_time The time of group created.
 @apiSuccess {Object} admin Admin of the group.
 @apiSuccess {String} admin.name The name of admin.
 @apiSuccess {String} admin.id The id of admin.
 @apiSuccess {Object[]} users Users in the group.
 @apiSuccess {String} users.name The name of users.
 @apiSuccess {String} users.id The id of users.

 @apiUse GroupNotExistError
 */

/**
 @api {get} /group/shares?group_id=:group_id 获取组内的share
 @apiVersion 0.1.5
 @apiName GetGroupShare
 @apiGroup ShareGroup
 @apiPermission member

 @apiDescription 根据group_id获取组内share.

 @apiParam {String} group_id The id of group.

 @apiSuccess {Object[]} shares Shares in the group.
 @apiSuccess {String} shares.title The title of shares.
 @apiSuccess {String} shares.intro Introduction("" if not exists).
 @apiSuccess {String} shares.id The id of shares.
 @apiSuccess {String} shares.url The url of shares.
 @apiSuccess {String} shares.share_time Time when share first made.
 @apiSuccess {Number} shares.comment_sum The sum of comments.
 @apiSuccess {Object} shares.origin First author of this share.
 @apiSuccess {String} shares.origin.nickname Name of first author.
 @apiSuccess {String} shares.origin.id Id of first author.
 @apiSuccess {String} shares.origin.avatar Avatar of first author.
 @apiSuccess {Object[]} shares.origin.others The rest of user who shared it.
 @apiSuccess {String} shares.origin.others.id Id of user.
 @apiSuccess {String} shares.origin.others.nickname Name of user.

 @apiUse GroupNotExistError
 @apiUse NotLoginError
 */

/**
 @api {post} /share 投递share（外部）
 @apiVersion 0.1.0
 @apiName PostShare
 @apiGroup Share
 @apiPermission login

 @apiDescription 从外部投递share，如果不选发送组，则发送到@me，
 接口对应inbox_share，这点需**格外注意**

 @apiParam {String} title Title of share.
 @apiParam {String} url Title of share.
 @apiParam {String} [comment] Comment of share.
 @apiParam {String[]} groups Name of groups to send share.

 @apiUse SuccessMsg

 @apiUse NotLoginError
 @apiUse OtherError
 */

/**
 @api {post} /share 投递InboxShare（外部）
 @apiVersion 0.1.0
 @apiName PostInboxShare
 @apiGroup InboxShare
 @apiPermission login

 @apiDescription 与投递到某个组的接口几乎相同，仅是groups为空数组.

 @apiParam {String} title Title of share.
 @apiParam {String} url Title of share.
 @apiParam {String} [comment] Comment of share.
 @apiParam {String[]} groups Name of groups to send share.

 @apiUse SuccessMsg

 @apiUse NotLoginError
 @apiUse OtherError
 */

/**
 @api {post} /login 登录
 @apiVersion 0.1.0
 @apiName Login
 @apiGroup User

 @apiDescription 使用邮箱密码登录.

 @apiParam {String} email Email as account.
 @apiParam {String} password Password.

 @apiUse MessageSuccess

 @apiUse OtherError
 */

/**
 @api {put} /inbox_share 推送InboxShare到group
 @apiVersion 0.1.0
 @apiName PutInboxShare
 @apiGroup InboxShare
 @apiPermission login

 @apiDescription 通过inbox_share_id和group_id推送InboxShare到特定的组.

 @apiParam {String} inbox_share_id Id of share.
 @apiParam {String} group_id Id of group.

 @apiUse SuccessMsg

 @apiUse NotLoginError
 @apiUse OtherError
 */
