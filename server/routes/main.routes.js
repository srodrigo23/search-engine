const express = require('express');
const router  = express.Router(); // res API

//const userCtrl = require('../controllers/user.controller')


router.get('/', (req, res) =>{
	res.render('index.pug');
});
//router.get('/', userCtrl.getUsers); //obtiene todos los usarios
//router.post('/', userCtrl.createUser); // creamos usuarios
//router.get('/:id', userCtrl.getUser);
//router.put('/:id', userCtrl.editUser);
//router.delete('/:id', userCtrl.deleteUser);
router.get('/a', (req, res) =>{
	res.render('2.pug');
});



module.exports = router; // para exportar