const mongoose = require('mongoose');//requiero mongoose

const { Schema } = mongoose;

const DocumentSchema = new Schema ({
	path : {type: String, required: true},
	titulo : {type: String, required: true},
	palabras :[{
			"carrera" : 10;
		},
		{
			"boda" : 15;
		}]
	//position : {type: String, required: true},
	//office:{type: String , required: true},
	//salary:{type: Number, required: true}
});

module.exports  = mongoose.model('Document', DocumentSchema);