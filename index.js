const express      = require('express');
const morgan       = require('morgan'); // 
const path         = require('path');
const bodyParser   = require('body-parser');
const fileUpload   = require('express-fileupload');
const { mongoose } = require('./server/database') //desde archivo solo quiero su conection
const app          = express(); 

//settings
app.set('port', process.env.PORT || 3000); //si el sitema te da un puerto usa si no usa 8080
app.set('views', __dirname + '/views');
app.set('view engine', 'pug'); //motor de plantillas  npm install pug --save 

//middlewares 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); //para usar morgan : dev : para como ver los comandos en consola
app.use(express.json());//para que el servidor entienda formato JSON para angular
//app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

//routes
//agragando prefijos
//app.use('/api/users', require('./routes/user.routes')); //pongo delante de la ruta
app.use('/', require('./server/routes/main.routes')); //pongo delante de la ruta

app.listen(app.get('port'), () => {
	console.log("Servidor en el puerto " + app.get('port'));
});