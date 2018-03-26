const express = require('express');
const app = express();
const db = require('./db');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/keywords', async (req, res)=> {
	let query = req.query.id;
	if(query){
		let data = await db.findDocumentsByKeyword(query);
		res.send(data);
		return;
	}
	let keywords = await db.getKeywords();
	res.send(keywords);
});


app.listen(3000,  ()=> {
	console.log('Example app listening on port 3000!');
});
