const handleImage = (req,res,db) => {

	/* Destructure request body */
	const { id } = req.body;

	/* Increment entries where id is the id of the request body */
	db('users').where('id','=', id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		/* Send the entry count back to the front-end to display */
		res.json(entries[0]);
	})
	.catch(err => {
		res.status(400).json('Unable to get entries');
	})
}

module.exports = {
	handleImage : handleImage
}