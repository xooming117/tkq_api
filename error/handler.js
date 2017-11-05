exports.getOptions = function () {
    const options = {
        json: function (err, ctx) {
            ctx.body = { code: err.status, msg: err.message }
            console.log(ctx.body)
        },
        accepts: function () { return "json" }
    }
    return options
}

getMsgByCode = function (statusCode) {
    let message = {
        200: { code: 200, msg: "成功" , msg1: "success" },
        401: { code: 401, msg: "没有权限",msg1: "no authentication" },
        404: { code: 404, msg: "资源没找到", msg1: "not found" },

        500: { code: 500, msg: "内部错误", msg1: "internal error" },
        501: { code: 501, msg: "账号已经存在", msg1: "account alreay exist" },
        502: { code: 502, msg: "账号不存在", msg1: "account not exist" },
        503: { code: 503, msg: "密码不正确", msg1: "password not right" },
        504: { code: 504, msg: "两次输入密码不一致", msg1: "the two passwords are differ" },
        505: { code: 505, msg: "没有找到用户", msg1: "not found user id"},

        510: { code: 510, msg: "无效参数", msg1: "invaild params" },
        511: { code: 511, msg: "操作失败", msg1: "operate failed" } 
    }
    return message[statusCode]
}

exports.getMsgByCode = function (statusCode) {
    return getMsgByCode(statusCode)
}

exports.inOutMsg = async function(ctx,next) {
    console.log('>>>>>>>>')
    console.log(ctx.request)
    console.log(ctx.request.body)
    await next
    console.log('<<<<<<<<')
    console.log(ctx.response)
}

exports.outMsg = function(ctx) {
    console.log(ctx.response)
}

exports.retMsg = function (ctx) {
    let status = ctx.res.statusCode
    if (status) {
        ctx.body = getMsgByCode(status)
    }
}

