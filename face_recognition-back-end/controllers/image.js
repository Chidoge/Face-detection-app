const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey : process.env.API_KEY
});

const handleAPICall = (req,res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
	.then(data => {
		console.log(data);
		res.json(data);
	})
	.catch(err => res.status(400).json('Unable to work with API'));
}




const handleImage = (req,res,db) => {

	/* Destructure request body */
	const { id } = req.body;

	/* Increment entries where id is the id of the request body */
	db('userss').where('id','=', id)
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
	handleImage : handleImage,
	handleAPICall : handleAPICall
}