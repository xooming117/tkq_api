'use strict'

const dbhelper = require('./dbhelper.js')
const dbman = require('./dbman.js')

exports.init = async ()=> {
	dbman.init()
}

// ok
exports.insertOne = async function (dbcc, data) {
	await dbhelper.createItem(dbcc, data)
	let cc = await dbman.getCcByDbccName(dbcc)
	return await cc.insertOne(data)
}

// ok
exports.insertMany = async function (dbcc, data) {
	await dbhelper.createItem(dbcc,data)
	let cc = await dbman.getCcByDbccName(dbcc)
	return await cc.insertMany(data)
}

// ok
exports.updateOne = async function (dbcc, find, data) {
	dbhelper.updateItem(data)
	let cc = await dbman.getCcByDbccName(dbcc)
	let re = await cc.findOneAndUpdate(find, {$set: data})
	return re.lastErrorObject.n
}

// ok
exports.deleteOne = async function (dbcc, find) {
	//deleteItem(data)
	let cc = await dbman.getCcByDbccName(dbcc)
	let re = await cc.findOneAndUpdate(find, {$set: {isDelete:true}})
	return re.lastErrorObject.n
}

// ok
exports.query = async function (dbcc, find, con) {
	if(!find) find={}
	if(!con) con={}
	dbhelper.queryItem(find,con)
	console.log(find)
	console.log(con)
	//console.log(con.project)
	let cc = await dbman.getCcByDbccName(dbcc)
	//console.log(find)
	return await cc.find(find).
					skip(con.skip).
					limit(con.limit).
					sort(con.sort).
					project(con.project).
					toArray()
}

exports.count = async function (dbcc, find, con) {
	if(!find) find={}
	if(!con) con={}
	dbhelper.queryItem(find,con)
	let cc = await dbman.getCcByDbccName(dbcc)
	return await cc.find(find).
					skip(con.skip).
					limit(con.limit).
					count()
}

exports.isOneExist = async function (dbcc, find) {
	let cc = await dbman.getCcByDbccName(dbcc)
	let re = await cc.find(find).toArray()
	if(re.length>0) {
		return true
	} else {
		return false
	}
}