const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const onError = require('koa-onerror')

const auth = require('./auth/auth.js')
const errMsg = require('./error/handler.js')

const app = new Koa()
const router = new Router()

// 1. 初始化数据库连接
require('./db/base.js').init()

// 2. 挂载错误处理
onError(app, errMsg.getOptions())

// 3. 权限认证
auth.init(app)

// 4. 解析form请求
app.use(bodyParser())

// 打印
//app.use(errMsg.inOutMsg)

// 5. 路由处理
require('./route/router.js').init(router, app)
app.use(router.routes())
app.use(router.allowedMethods())

// 6. 错误处理格式转换
app.use(errMsg.retMsg)

// 7. 开始监听
app.listen(3030, () => {
    console.log('Restful api listening 3030...')
})