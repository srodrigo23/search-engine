 const mongoose = require('mongoose');//requiero mongoose

const { Schema } = mongoose;

const WordsSchema = new Schema ({
	palabras :{
		"carrera" : 10;
		"boda" : 15;
		...






		
	}
	//position : {type: String, required: true},
	//office:{type: String , required: true},
	//salary:{type: Number, required: true}
});

module.exports  = mongoose.model('Document', DocumentSchema);