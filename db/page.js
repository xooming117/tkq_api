exports.pageGoods = function (params) {
    let page = { find: {}, con: {} };
    
    // con
    if (!params.skip) {
        page.con.skip = 0
    } else {
        page.con.skip = Number(params.skip)
    }
    if (!params.limit) {
        page.con.limit = 0
    } else {
        page.con.limit = Number(params.limit)
    }


    //　销量排序
    if(params.hot) {
        params.hot = Number(params.hot)
        //　降序排序
        if(params.hot===1) {
            page.con.sort = {volume:-1}
        } else {
            page.con.sort = {}
        }
    } else {
        page.con.sort = {}
    }
    
    console.log('params')
    console.log(params)

    // find
    if (params.name) {
        page.find.title = new RegExp(params.name)
    }
    if (params.coupon_price1 && params.coupon_price2) {
        if (params.coupon_price1 >= params.coupon_price2) {
            params.coupon_price1 = params.coupon_price2 - 1
        }
        page.find.zkPrice = { $gt: Number(params.coupon_price1), $lt: Number(params.coupon_price2) }
    }
    if(params.volume1 && params.volume2) {
        if (params.volume1 >= params.volume2) {
            params.volume1 = params.volume2 - 1
        }
        page.find.totalNum = { $gt: Number(params.volume1), $lt: Number(params.volume2) }
    }
    // if(params.commission_rate1 && params.commission_rate2) {
    //     if (params.commission_rate1 >= params.commission_rate2) {
    //         params.commission_rate1 = params.commission_rate2 - 1
    //     }
    //     page.find.topRate = { $gt: Number(params.commission_rate1), $lt: Number(params.commission_rate2) }
    // }
    console.log('page')
    console.log(page)
    return page
}