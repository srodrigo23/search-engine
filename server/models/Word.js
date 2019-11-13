 const mongoose = require('mongoose');//requiero mongoose

const { Schema } = mongoose;

const WordSchema = new Schema ({
	palabras : {type: String, required: true},
	cantidad : {type: Number, required : true}
});

module.exports  = mongoose.model('Word', WordSchema);