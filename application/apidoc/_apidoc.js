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
 * @apiDefine NotLoginError
 * @apiVersion 0.1.0
 * @apiError NotLogin  Users must login to invoke this api.
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
