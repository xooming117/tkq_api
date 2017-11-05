exports.init = (dbman)=> {
    // 创建唯一索引，插入数据时被动失败
    const unidx = [{cc:'goods', field: {num_iid:1}}]
    unidx.map(async (item)=>{
        let cc = await dbman.getCc(item.cc)
        cc.createIndex( item.field, { unique: true } )
    }) 
    console.log(' ::index:: ::init:: success')
}