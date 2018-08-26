const handleSignIn = (req, res, db, bcrypt) => {

	/* Destructure request body */
	const { email, password } = req.body;

	/* Grab hash from login table of requested login email */
	db.select('email','hash').from('login')
	.where('email','=', email)
	.then(data => {

		/* Use synchronous hash compare */
		const isValid = bcrypt.compareSync(password,data[0].hash);
		
		/* On hash match, return the user object from user table */
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
		/* On password mismatch, send the error code to the front-end */
		else {
			res.status(400).json('wrongPW');
		}
	})
	/* On db failure, send error code */
	.catch(err => {
		res.status(400).json('Wrong credentials');
	})
}

module.exports = {
	handleSignIn : handleSignIn
}