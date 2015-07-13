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
