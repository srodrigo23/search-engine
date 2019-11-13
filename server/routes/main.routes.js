const express  = require('express');
const router   = express.Router();
const fs       = require('fs');
const Document = require('../models/Document');
var emptyWords = new Array();
var preparedQuery;
var message = '';
var words;
var documents;
var lista;

function readFile(ruta) {
	try {  
		var data = fs.readFileSync(ruta, 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}
	return data;
}

function eraseTags(content){
   if ((content===null) || (content===''))
       return false;
	else
   		content = content.toString();
  	return content.replace(/<[^>]*>/g, '');
}

router.get('/', (req, res) =>{
	res.render('index.pug', {message : message, lista:lista});
});

function prepareSearcher(term){
	emptyWords    = readFile('./files/empty_words.txt').split('\n');
	preparedQuery = prepareQuery(term);
}

router.post('/', (req, res)=>{
	var term = req.body.aBuscar;

	prepareSearcher(term);
	if (term === ''){
		message = 'Termino de búsqueda no puede estar vacío';
		res.redirect('/');
	}else{
		message = '';
		Document.find({}, function(err, document){
			if (err) { return done(err); }
			documents = document;
			var d;
			words = [];
			for(let i=0; i<documents.length; i++){
				d = documents[i].dictionary;
				for(let j=0; j<d.length; j++){
					words.push(d[j].word);
				}
			}
			var aux = words, cont = 0, value;
			words = [];
			for (let i = 0; i < aux.length-1; i++) {
				value = aux[i];
				if(value!=''){
					cont = 1;
					for (let j = i+1; j < aux.length; j++) {
						if(value === aux[j]){
							aux[j]='';
							cont++;
						}
					}
					words.push({word : value, amount : cont});
				}
			}
			var dictionary = [], w, a, idf;
			for(let i=0; i< documents.length; i++){
				var d = []; 
				for(let j=0; j < documents[i].dictionary.length; j++){
					w = documents[i].dictionary[j].word;
					a = documents[i].dictionary[j].amount;
					idf = Math.log10(documents.length/wordsInDocs(w)) * a 
					d.push({word : w, amount : a, idf : idf});
				}
				dictionary.push(d);
			}
			lista = modeloVectorial(dictionary, preparedQuery)
		});
		res.redirect('/')
		//res.render('index.pug', {lista:lista}) 
	}
});

function modeloVectorial(dictionary, preparedQuery){
	var ans = [], value, q, idf;
	for(let i=0; i < dictionary.length; i++){
		value = 0;
		for(let j =0; j< preparedQuery.length; j++){
			q = preparedQuery[j];
			if(wordsInDocs(q)>0){
				idf = obtainIDF(dictionary[i],q);
				if (idf != undefined)
					value = value + (idf * idf) 
			}
		}
		ans.push({path : documents[i].path, sim : value});
	}
	//console.log(ans);
	var aux;
	for(let i=0; i<ans.length-1; i++){
		for(let j=0; j<ans.length; j++){
			if(ans[i].sim > ans[j].sim){
				aux = ans[i];
				ans[i] = ans[j];
				ans[j] = aux;
			}
		}
	}
	return ans;
}

function obtainIDF(dictionary, q){
	for (let i = 0; i < dictionary.length; i++) {
		if(dictionary[i].word === q){
			return dictionary[i].idf;
		}
	}
}

function wordsInDocs(w){
	//console.log(words)
	for (let i = 0; i < words.length; i++) {
		if (words[i].word === w){
			return words[i].amount;
		}
	}
	//return 0;
}

router.post('/upload',function(req,res){
	var file;
	if(req.files){
		var file = req.files.page;
		name     = file.name;
		type     = file.mimetype;
		if(type === 'text/html'){
			var uploadpath = __dirname + '/files/' + name;
			file.mv(uploadpath,function(err){
				if(err){
					message = "Un error ha ocurrido!"; 
				}else{
					message ='Subido con exito!';
					var docum = new Document();
					docum.path = uploadpath;
					docum.dictionary = prepareFile(uploadpath);
					docum.save(function (err) {
						if (err) { throw err; }	
					});
				}
			});
		}else {
			message = "Formato no soportado";
		}
	}else{
		message = 'Ningun archivo elegido!';
	}
	res.redirect('/');
});

function prepareFile(file){
	emptyWords = readFile('./files/empty_words.txt').split('\n');
	file = eraseTags(readFile(file)).split(' ');
	var ans  = [];
	file.forEach(el => {
		el = el.replace(/\n/g, '');
		el = el.toLowerCase();
		el = el.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		el = el.replace(/[^a-zA-Z ]/g, "");
		if(el != '' ){
			if(!emptyWords.includes(el)){
				ans.push(el)
			}
		}
		ans.sort();
	});
	var aux = ans, cont = 0, value;
	ans = [];
	for (let i = 0; i < aux.length-1; i++) {
		value = aux[i];
		if(value!=''){
			cont = 1;
			for (let j = i+1; j < aux.length; j++) {
				if(value === aux[j]){
					aux[j]='';
					cont++;
				}
			}
			ans.push({word : value, amount : cont});
		}
	}

	return ans;
}

function prepareQuery(query){
	var pq = [],  q  = query.trim().split(' ');
	q.forEach(el => {
		if(!emptyWords.includes(el))
			pq.push(el)
	});
	return pq;
}
module.exports = router;