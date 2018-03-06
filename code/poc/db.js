const mysql      = require('mysql');
let db = {};

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'me',
	password : 'secret',
	database : 'my_db'
});
db.connect = ()=>{
	connection.connect();
};

db.save = (data)=>{
	connection.query('INSERT INTO bocm VALUES (', function (error, results, fields) {
		if (error) throw error;
		console.log('The solution is: ', results[0].solution);
	});

};

db.close = ()=>{
	connection.end();
};

