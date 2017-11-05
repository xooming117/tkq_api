'use strict'

const util = require('util');
const fs = require('fs');
var crypto = require('crypto');
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient

const index = require('./index.js')
const seq = require('./seq.js')

exports.HOME = 0;
exports.YSD = 1;
exports.TBK = 2;
exports.LY  = 3;
const ALL = 4;

var dbContainer = {
	0: {opts:{ name:'home', ip:'mongodb', port:27017, user:'', pwd:''}, db:null, cc:['account','user','seq']},
	1: {opts:{ name:'ysd', ip:'mongodb', port:27017, user:'', pwd:''}, db:null, cc:['goods']},
	2: {opts:{ name:'tbk_database', ip:'mongodb', port:27017, user:'', pwd:''}, db:null, cc:['goods']},
	3: {opts:{ name:'ly', ip:'mongodb', port:27017, user:'', pwd:''}, db:null, cc:[]},
}

var dbNameToNo = {
	home:0,
	ysd:1,
	tbk_database:2,
	ly:3
}

exports.isCcExist = (obj) => {
	for (let i = 0; i < ALL; i++) {
		let item = dbContainer[i]
		if(item.opts.name === obj.db) {
			if(contains(item.cc, obj.cc)) {
				return obj
			}
		}
	}
	return null
}

function contains(arr, obj) {  
    let i = arr.length;  
    while (i--) {
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

const getCcByName = async(ccname) => {
	let cc
	for (let i = 0; i < ALL; i++) {
		let item = dbContainer[i]
		if(contains(item.cc, ccname)) {
			cc = await item.db.collection(ccname)
			break
		}
	}
	return cc
}

const initDb = async (item) => {
	let $self = this
	MongoClient.connect('mongodb://'+item.opts.ip+':'+item.opts.port+'/'+item.opts.name, function(err, db) {
		if(err) {
			console.log(err)
		} else {
			item.db = db
			console.log('connect '+item.opts.name+' success ... ')
			
			// 在home中初始化所有sequence
			if(item.opts.name==='home') {
				seq.init($self)
			}
			//　初始化一手单中唯一索引
			if(item.opts.name==='ysd') {
				index.init($self)
			}
		}
	})
}

const destDb = (item) => {
	item.db.close()
	item.db = null
}

exports.init = () => {
	for (let i = 0; i < ALL; i++) {
		let item = dbContainer[i]
		if(item) {
			initDb(item)
		}
	}
}

exports.rels = () => {
	for (let i = 0; i < ALL; i++) {
		let item = dbContainer[i]
		if(item) {
			destDb(item)
		}
	}
}

exports.getCcByDbccName = async(dbcc) => {
	return await dbContainer[dbNameToNo[dbcc.db]].db.collection(dbcc.cc)
}

exports.getCc = async (ccName) => {
	let cc=null
	try {
		cc =  await getCcByName(ccName)
	}catch(e) {
		console.log(e)
	}
	return cc
}
