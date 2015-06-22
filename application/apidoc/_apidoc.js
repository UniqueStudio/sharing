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
 * @apiErrorExample Response:
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
 * @apiErrorExample Response:
 *     HTTP/1.1 403 Forbidden
 */

/**
 * @apiDefine OtherError
 * @apiVersion 0.1.0
 * @apiError SomeErrorInDetail Errors in detail.
 * @apiErrorExample Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "failure",
 *       "reason": String
 *     }
 */
