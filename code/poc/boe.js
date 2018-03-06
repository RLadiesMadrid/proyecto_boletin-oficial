const request = require('request');
const fs = require('fs');
const PDFParser = require("pdf2json");
const moment = require('moment');
let dateInit = moment("2018-01-01");
let dateEnd = moment();
const db = require('./db');
// while (currentDate < dateEnd){
//
// 	setTimeout(()=>{
// 		let urlBase = "https://www.bocm.es/boletin/CM_Orden_BOCM/2018/03/03/BOCM-20180303-1.PDF";
// 		let pdfParser = new PDFParser(this,1);
// 		pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// 		pdfParser.on("pdfParser_dataReady", pdfData => {
// 			fs.writeFile("./bocm"+date+".txt", pdfParser.getRawTextContent());
// 		});
// 		request({url: urlBase, encoding:null}).pipe(pdfParser);
// 		currentDate = dateInit.add(1,'days');
// 	},4000);
// }

function getData(date,index){
	if (date < dateEnd){
		try{

		const url = 'https://www.bocm.es/boletin/CM_Orden_BOCM/'+date.format('YYYY/MM/DD') + '/BOCM-'+date.format('YYYYMMDD') + '-'+index+'.PDF';
		console.log(url);
		let pdfParser = new PDFParser(this,1);
		pdfParser.on("pdfParser_dataError", errData => {
			console.error(errData.parserError);
			setTimeout(()=>{
				getData(date.add(1,'days'),1);
			},4000)
		});
		pdfParser.on("pdfParser_dataReady", async pdfData => {
			fs.writeFile("./bocm"+date+"-index"+index+".txt", pdfParser.getRawTextContent());
			await
			setTimeout(()=>{
				index++;
				getData(date,index);
			},4000)
		});
		request({url: url, encoding:null}).pipe(pdfParser);
		} catch (err) {
			setTimeout(()=>{
				getData(date,index);},4000)
		}
	}
}
db.connect();
getData(dateInit,54);
