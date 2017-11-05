'use strict'

const jwt = require('jsonwebtoken')

const auth = require('../auth/auth.js')
const account = require('../user/account.js')
const user = require('./user.js')

exports.init = function (router) {
    // 登录
    router.post("/api/v1/auth/login", async (ctx, next) => {
        let re = await account.login(ctx.request.body)
        if (re.code === 200) {
            let userData = {
                id: re.id
            }
            // console.log(userData)
            let token = auth.getToken(userData)  //token签名
            console.log('>>>>>>>>>>>'+token)
            let retoken = auth.getReToken(userData)
            ctx.body = {
                code: 200,
                msg: 'login success',
                token,
                retoken
            }
        } else {
            ctx.body = re
        }
    })

    // 注册
    router.post("/api/v1/auth/register", async (ctx, next) => {
        ctx.body = await account.register(ctx.request.body)
    })

    // 修改密码
    router.put("/api/v1/auth/modpwd", async (ctx, next) => {
        ctx.request.body.id = ctx.payload.id
        ctx.body = await account.modPwd(ctx.request.body)
    })

    // 重置密码
    router.put("/api/v1/auth/resetpwd", async (ctx, next) => {
        ctx.request.body.id = ctx.payload.id
        ctx.body = await account.modPwd(ctx.request.body)
    })

    // 修改用户信息
    router.put("/api/v1/auth/update", async (ctx, next) => {
        // 传递账号id到user
        ctx.request.body.aid = ctx.payload.id
        ctx.body = await user.updateUserInfoByAid(ctx.request.body)
    })

    // 获取用户信息
    router.get("/api/v1/auth/getinfo", async (ctx, next) => {
        // 传递账号id到user
        ctx.request.body.aid = ctx.payload.id
        ctx.body = await user.getUserInfoByAid(ctx.request.body)
    })
}