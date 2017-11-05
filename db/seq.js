exports.db = null

const initOneSeq = async (dbman, name) => {
    let cc = await dbman.getCc('seq')
	let re = await cc.find({_id:name}).toArray()
	if(re.length==0) {
		await cc.insertOne({_id:name,seq:0})
	}
}

const initAllSeq = (dbman) => {
	let seqId = ['account','user','goods']
	seqId.map(async (id)=> {
		await initOneSeq(dbman, id)
	})
}

exports.init = (dbman) => {
	initAllSeq(dbman)
    db = dbman
	console.log(' ::seq:: ::init:: success')
}

exports.getNextSequence = async function (name) {
	let cc = await db.getCc('seq')
  	let results = await cc.findOneAndUpdate(
					{_id: name},
					{$inc: {seq: 1}},
					{returnOriginal: false});
  	return results.value.seq
}