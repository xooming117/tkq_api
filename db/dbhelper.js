const seq = require('./seq.js')

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

// ok
exports.createItem = async (dbcc, data) => {
	if(data instanceof Array) {
		for(let i=0; i<data.length; i++) {
			data[i]._id = await seq.getNextSequence(dbcc.cc)
			data[i].isDelete = false
			data[i].createAt = new Date()
			data[i].updateAt = data[i].createAt
		}
	} else {
		data._id = await seq.getNextSequence(dbcc.cc)
		data.isDelete = false
		data.createAt = new Date()
		data.updateAt = data.createAt
	}
	//console.log(name)
}

exports.updateItem = (data) => {
	if(data instanceof Array) {
		data.map(function(item) {
			item.updateAt = new Date()
		})
	} else {
		data.updateAt = new Date()
	}
}

exports.deleteItem = (data) => {
	if(data instanceof Array) {
		data.map(function(item) {
			item.isDelete = true
		})
	} else {
		data.isDelete = true
	}
}

// ok
exports.queryItem = (find,con) => {
	find.isDelete = false
	if(!con.skip) {
		con.skip = 0
	}
	if(!con.limit) {
		con.limit = 0
	}
	if(!con.project) {
		con.project = {}
		con.project.isDelete = 0
	}
	if(!con.sort) {
		con.sort = {}
	}
}