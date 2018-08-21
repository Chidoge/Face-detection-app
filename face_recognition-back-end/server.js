const express = require('express');

const app = express();

app.get('/', (req,res) => {
	res.send('this is working');
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