const crypto = require('crypto')

const db = require('../db/base.js')
const errmsg = require('../error/handler.js')
const user = require('./user.js')

var md5 = function (str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var generateSalt = function () {
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var saltAndHash = function (pass) {
	var salt = generateSalt();
	return salt + md5(pass + salt)
}

var validatePassword = function (plainPass, hashedPass) {
	var salt = hashedPass.substr(0, 10)
	var validHash = salt + md5(plainPass + salt)
	return (hashedPass === validHash)
}

exports.login = async function (params) {
	if (params.account && params.password) {
		let dbcc = {db:'home',cc:'account'}
		let re = await db.query(dbcc, { account: params.account })
		if (re.length > 0) {
			if (validatePassword(params.password, re[0].password)) {
				return { code: 200, id: re[0]._id, message: 'login success' }
			} else {
				return errmsg.getMsgByCode(503)
			}
		} else {
			return errmsg.getMsgByCode(502)
		}
	} else {
		return errmsg.getMsgByCode(510)
	}
}

exports.register = async function (params) {
	if (params.account && params.password) {
		let dbcc = {db:'home',cc:'account'}
		let re = await db.isOneExist(dbcc, { account: params.account })
		if (re) {
			return errmsg.getMsgByCode(501)
		} else {
			let re = await db.insertOne(dbcc, { account: params.account, password: saltAndHash(params.password) })
			if(re.insertedId) {
				await user.insertUser({aid: re.insertedId})
			}
			return { code: 200, message: 'register success' }
		}
	} else {
		return errmsg.getMsgByCode(510)
	}
}

exports.modPwd = async function (params) {
	let _id = Number(params.id);
	let oldone = params.oldpwd; let newone = params.newpwd;
	let repwd = params.repwd;
	if(newone !== repwd) {
		return errmsg.getMsgByCode(504)
	}

	if (_id && oldone && newone) {
		let dbcc = {db:'home',cc:'account'}
		let re = await db.query(dbcc, {_id})
		if (re.length > 0) {
			if (validatePassword(oldone, re[0].password)) {
				await db.updateOne(dbcc, {_id}, {password: saltAndHash(newone) })
				return { code: 200, message: 'modify pwd success' }
			} else {
				return errmsg.getMsgByCode(503)
			}
		} else {
			return errmsg.getMsgByCode(502)
		}
	} else {
		return errmsg.getMsgByCode(510)
	}
}

exports.updateInfo = async function (params) {
	return user.updateUserInfo(params);
}
