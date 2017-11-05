var unless = require('koa-unless')


// 验证token
module.exports = function () {
    let verifyToken = async (ctx, next) => {
        console.log('ctx.url:' + ctx.url)
        let is = false
        if (!ctx.payload) {
            let token = ctx.header.authorization  // 获取jwt
            console.log(token)
            if (token && token.length > 20) {
                ctx.payload = await verify(token.split(' ')[1], secret().secret) // 解密，获取payload
                console.log(ctx.payload)

                if (ctx.payload.jti) {
                    if (nonce.isExist(Number(ctx.payload.jti))) {
                        throw new Error('repeat jti')
                    } else {
                        let data = {}
                        data.id = ctx.payload.id
                        let token = getToken1(data)
                        ctx.payload.token1 = token
                        is = true
                    }
                }
            }
        }
        await next();
        if (is) {
            ctx.body.token = ctx.payload.token1
        }
    }

    verifyToken.unless = unless

    return verifyToken
}
