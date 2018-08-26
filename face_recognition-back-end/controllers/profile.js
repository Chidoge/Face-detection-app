const handleProfileGet = (req,res,db) => {

	/* Destructure request parameters */
	const { id } = req.params;

	/* If there is a user with a matching id, return this user object */
	db.select('*').from('users').where({id})
	.then(user => {
		if (user.length) {
			res.json(user[0]);
		}
		else {
			res.status(400).json('User not found');
		}
	});
}

module.exports = {
	handleProfileGet : handleProfileGet
}