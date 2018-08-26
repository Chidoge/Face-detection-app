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


app.get('/', (req,res) => {

	res.send(db.users);
})


app.post('/signin', (req,res) => {

	const { email, password } = req.body;

	db.select('email','hash').from('login')
	.where('email','=', email)
	.then(data => {

		const isValid = bcrypt.compareSync(password,data[0].hash);
		if (isValid) {
			return db.select('*').from('users')
			.where('email','=',email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => {
				res.status(400).json('Unable to get user');
			})
		}
		else {
			res.status(400).json('wrongPW');
		}
	})
	.catch(err => {
		res.status(400).json('Wrong credentials');
	})
})


app.post('/register', (req,res) => {

	/* Destructure request.body object */
	const { email, name, password } = req.body;

	/* Synchronous hashing */
	const hash = bcrypt.hashSync(password);

	/* Transaction for consistency */
	db.transaction(trx => {
		trx.insert({
			hash : hash,
			email : email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({ 
				email : loginEmail[0],
				name : name,
				joined : new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to register'));
		
})


app.get('/profile/:id', (req,res) => {

	const { id } = req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		if (user.length) {
			res.json(user[0]);
		}
		else {
			res.status(400).json('User not found');
		}
	});
})


app.put('/image', (req,res) => {

	const { id } = req.body;
	db('users').where('id','=', id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => {
		res.status(400).json('Unable to get entries');
	})
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