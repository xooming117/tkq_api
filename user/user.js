const crypto = require('crypto')

const db = require('../db/base.js')
const dbman = require('../db/dbman.js')
const errMsg = require('../error/handler.js')

const update = async(find, data) => {
	let dbcc = dbman.isCcExist({db:'home', cc:'user'})
	let re = await db.updateOne(dbcc, find, data)
	// 操作成功
	if(re) {
		return {code:200, msg:'operate succes'}
	} else // 操作失败
	{
		return errMsg.getMsgByCode(505)
	}
}

exports.insertUser = async(params) => {
	let aid = params.aid
	let dbcc = dbman.isCcExist({db:'home', cc:'user'})
	if(aid && dbcc) {
		await db.insertOne(dbcc, { aid })
		return { code: 200, message: 'add user success' }
	} else {
		return errMsg.getMsgByCode(510)
	}
}

exports.getUserInfoByAid = async function(params) {
	let aid = Number(params.aid);
	let dbcc = dbman.isCcExist({db:'home', cc:'user'})
    if(aid && dbcc) {
        let data = await db.query(dbcc, { aid })
		console.log(data)
		return { code:200, data: data[0] }
	}
	//　没有找到用户
	else {
		return errMsg.getMsgByCode(510)
	}
}

exports.updateUserInfoByAid = async function(params) {
	let aid = Number(params.aid); let wxpid = params.wxpid; let qqpid = params.qqpid;
	let qqcode = params.qqcode; let nickname = params.nickname;

	if (aid) {
		//　更新qq号码和昵称
		if (qqcode && nickname) {
			return update({ aid }, { qqcode, nickname })
		}
		//　更新pid
		else if (wxpid && qqpid) {
			return update({ aid }, { wxpid, qqpid });
		} 
		// 参数错误
		else {
			return errMsg.getMsgByCode(510)
		}
	}
	//　没有找到用户
	else {
		return errMsg.getMsgByCode(505)
	}
}
