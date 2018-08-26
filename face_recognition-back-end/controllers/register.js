const handleRegister = (req, res, db, bcrypt) => {

	/* Destructure request body */
	const { email, name, password } = req.body;

	/* Synchronous hashing */
	const hash = bcrypt.hashSync(password);

	/* Transaction for consistency */
	db.transaction(trx => {

		/* First insert into login table */
		trx.insert({
			hash : hash,
			email : email
		})
		.into('login')

		/* Get email from login table if insertion was successful and add this to the users table */
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({ 
				email : loginEmail[0],
				name : name,
				joined : new Date()
			})
			/* On successful API call, return the user object to the front-end */
			.then(user => {
				res.json(user[0]);
			})
		})
		/* Commit changes */
		.then(trx.commit)
		/* Delete transaction if failed anywhere */
		.catch(trx.rollback)
	})
	/* Return 400 if failed */
	.catch(err => res.status(400).json('Unable to register'));
		
}

module.exports = {
	handleRegister : handleRegister
}