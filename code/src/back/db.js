const mysql  = require('mysql');
const config = require('./config');
let db = {};
const connection = mysql.createConnection(config.db);

db.connect = ()=>{
	return connection.connect();
};

db.getKeywords = () =>{
	return new Promise((resolve, reject)=>{
		connection.query('SELECT * FROM KEYWORDS',(error, results)=> {
			if (error) reject(error);
			resolve(results);
		});
	})
};

db.findDocumentsByKeyword =() =>{

};

db.saveText = (text,code,date,link)=>{
	return new Promise((resolve, reject)=>{
		let query = 'INSERT INTO rawtext (text,code,date,link) VALUES ("'+text+'","'+code+'","'+date+'","'+link+'")';
		connection.query(query, (error, results, fields)=> {
			if (error) reject(error);
			resolve(results,fields);
		});
	});
};

db.saveKeywords = (keywords)=>{
	return new Promise((resolve, reject)=>{
		if(typeof keywords !== 'string'){
			keywords = keywords.join(',');
		}
		connection.query('INSERT INTO keywords (keyword) VALUES ('+keywords+')', (error, results, fields)=> {
			if (error) reject(error);
			resolve(results,fields);
		});
	});
};

db.saveTextKeyword = (textid,keywordid,times) =>{
	return new Promise((resolve, reject)=>{
		connection.query('INSERT INTO rawtext_keywords (rawtextid,keywordid,times) VALUES ('+textid+','+keywordid+','+times+')', (error, results, fields)=> {
			if (error) reject(error);
			resolve(results,fields);
		});
	});
};

db.close = ()=>{
	connection.end();
};

module.exports = db;

