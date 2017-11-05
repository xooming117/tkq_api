'use strict'

const util = require('util')
const jwt  = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const _ = require('underscore')
var unless = require('koa-unless')

const nonce = require('./nonce.js')

const verjwt = require('./verjwt.js')

const verify = util.promisify(jwt.verify) // 解密
const jticon = [];

// 秘钥
const secret = () => {
    return {secret: 'this is a very jwt key'}
}

// 秘钥过期时间
const getExpires = () => {
    let expires = { expiresIn: '60s' } //3600秒
    return expires
}

// 秘钥过期时间
const getRefreshExpires = () => {
    let expires = { expiresIn: '86400s' } //1天
    return expires
}

// 数组中的路径不需要通过jwt验证
function path() {
    return [/^\/api\/v1\/auth\/login/,
            /^\/api\/v1\/auth\/register/,
            /^\/api\/v1\/os\/ysd\/goods/,
            /^\/api\/v1\/os\/tbk_database\/goods/,
            /^\/index/]
}

const getSecret = function() {
    return secret()
}

// 请求token
const _getToken = (data) => { 
    let conf = getExpires()
    conf.jwtid = ''+nonce.genjti()
    return jwt.sign(data, getSecret().secret, conf)
}

// 验证token
let verifyToken = async (ctx,next) => {
    let isGenToken = false
    if (!ctx.payload) {
        let token = ctx.header.authorization  // 获取jwt
        console.log('<<<<<<<<<<'+token)
        if(token&&token.length>20) {
            ctx.payload = await verify(token.split(' ')[1], secret().secret) // 解密，获取payload
            console.log(ctx.payload)
            
            if(ctx.payload.jti) {
                if(nonce.isExist(Number(ctx.payload.jti))) {
                    throw new Error('repeat jti')
                } else {
                    let data = { id : ctx.payload.id }
                    ctx.payload.token = _getToken(data)
                    isGenToken = true
                }
            }
        }
    }
    await next();
    if(isGenToken) {
        ctx.body.token = ctx.payload.token
        console.log('>>>>>>>>'+ctx.body.token)
    }
}
verifyToken.unless = unless

// 跨域访问和日志
const crosAccess = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin','*')
    ctx.set('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, x-custom-header, Authorization')
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    //console.log(ctx.body)
};


// 请求token
exports.getToken = (data) => { 
    return _getToken(data)
}

// 刷新refreshToken
exports.getReToken = (data) => { 
    let conf = getRefreshExpires()
    conf.jwtid = ''+nonce.genjti()
    return jwt.sign(data, getSecret().secret, conf)
}

exports.init = (app) => {
    // 跨域访问
    app.use(crosAccess)
    
    // 权限验证
    app.use(jwtKoa( secret() ).unless({ method:'OPTIONS',path: path() }))
    
    // 打印token
    app.use(verifyToken.unless({ method:'OPTIONS',path: path() }))
    // app.use(verjwt().unless({ method:'OPTIONS',path: path() }))
}

