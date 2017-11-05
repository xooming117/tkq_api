'use strict'

const base = require('../db/base.js')
const dbman = require('../db/dbman.js')
const paging = require('../db/page.js')
const errMsg = require('../error/handler.js')

exports.init = function (router) {
    // 获取多个
    router.get("/api/v1/os/:repo/:cc", async (ctx, next) => {
        let db = ctx.params.repo; let cc = ctx.params.cc;
        let dbcc = dbman.isCcExist({db,cc})
        if(dbcc) {
            //console.log(ctx.request.query)
            let page = paging.pageGoods(ctx.request.query)
            //console.log(page)
            let data = await base.query(dbcc, page.find, page.con)
            let count = await base.count(dbcc, page.find, page.con)
            ctx.body = { code: 200, total: count, size: data.length, data: data }
        } else {
            ctx.body = errMsg.getMsgByCode(404)
        }
    })

    // 获取一个
    router.get("/api/v1/os/:repo/:cc/:id", async (ctx, next) => {
        let db = ctx.params.repo; let cc = ctx.params.cc;
        let _id = Number(ctx.params.id);
        let dbcc = dbman.isCcExist({db,cc})
        if(dbcc && _id) {
            let data = await base.query(dbcc, { _id })
            ctx.body = { code:200, total: data.length, data: data }
        } else {
            ctx.body = errMsg.getMsgByCode(404)
        }
    })

    // 增加一个
    router.post("/api/v1/os/:repo/:cc", async (ctx, next) => {
        let db = ctx.params.repo; let cc = ctx.params.cc;
        let dbcc = dbman.isCcExist({db,cc})
        if(dbcc) {
            await base.insertOne(dbcc, ctx.request.body)
            ctx.body = errMsg.getMsgByCode(200)
        } else {
            ctx.body = errMsg.getMsgByCode(404)
        }
    })

    // 修改一个
    router.put("/api/v1/os/:repo/:cc/:id", async (ctx, next) => {
        let db = ctx.params.repo; let cc = ctx.params.cc;
        let _id = Number(ctx.params.id)
        let dbcc = dbman.isCcExist({db,cc})
        if(dbcc) {
            let re = await base.updateOne(dbcc, { _id }, ctx.request.body)
            if (re) {
                ctx.body = errMsg.getMsgByCode(200)
            } else {
                ctx.body = errMsg.getMsgByCode(505)
            }
        } else {
            ctx.body = errMsg.getMsgByCode(404)
        }
    })

    // 删除一个
    router.delete("/api/v1/os/:repo/:cc/:id", async (ctx, next) => {
        let db = ctx.params.repo; let cc = ctx.params.cc;
        let _id = Number(ctx.params.id)
        let dbcc = dbman.isCcExist({db,cc})
        if(dbcc && _id) {
            let re = await base.deleteOne(dbcc, { _id })
            if (re) {
                ctx.body = errMsg.getMsgByCode(200)
            } else {
                ctx.body = errMsg.getMsgByCode(505)
            }
        } else {
            ctx.body = errMsg.getMsgByCode(404)
        }
    })
}