const moment = require('moment');
const request = require('request');
const fs = require('fs');
const PDFParser = require("pdf2json");
let getData = {};

getData.get = (url)=>{
	return new Promise((resolve,reject )=>{
		try{
			let pdfParser = new PDFParser(this,1);
			request({url: url, encoding:null}).pipe(pdfParser);
			pdfParser.on("pdfParser_dataError", errData => {
				reject(errData);
			});
			pdfParser.on("pdfParser_dataReady", pdfData => {
				resolve(pdfParser.getRawTextContent());
			});
		} catch (err) {
			reject(err);
		}
	});
};
module.exports = getData;

