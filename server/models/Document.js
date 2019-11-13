const mongoose = require('mongoose');//requiero mongoose

const { Schema } = mongoose;
//const word = require('Word');
const DocumentSchema = new Schema ({
	path       : String,
	dictionary : [{ word : String, amount : Number }]
});
module.exports  = mongoose.model('Document', DocumentSchema);