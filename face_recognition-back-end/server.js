const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
	client : 'pg',
	connection : {
		host : '127.0.0.1',
		user : 'postgres',
		password : '',
		database : 'smartbrain',
	}
});


const app = express();
app.use(cors());
app.use(bodyParser.json());

db.select('*').from('users').then(data => {
	console.log(data);
});


app.get('/', (req,res) => {

	res.send(db.users);
})


app.post('/signin', (req,res) => {


	if (req.body.email === db.users[0].email && 
		req.body.password === db.users[0].password ) {
		res.json(db.users[0]);
	}
	else {
		res.status(400).json('fail');
	}
})


app.post('/register', (req,res) => {

	const { email, name, password } = req.body;

	db('users')
	.returning('*')
	.insert({ 
		email : email,
		name : name,
		joined : new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json('unable to register'));
})


app.get('/profile/:id', (req,res) => {

	const { id } = req.params;
	var found = false;
	db.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('no such user');
	}

})

app.put('/image', (req,res) => {

	const { id } = req.body;
	var found = false;
	db.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(404).json('no such user');
	}
})

app.listen(3000, () => {
	console.log("Server started");
});


/*
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT = user

*/