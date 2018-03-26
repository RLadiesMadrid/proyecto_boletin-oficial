const request = require('request');
const PDFParser = require("pdf2json");
const moment = require('moment');
let dateInit = moment("2017-10-01");
let dateEnd = moment();
const db = require('./db');

function getData(date,index){
	if (date < dateEnd){
		try{
			const url = 'https://www.bocm.es/boletin/CM_Orden_BOCM/'+date.format('YYYY/MM/DD') + '/BOCM-'+date.format('YYYYMMDD') + '-'+index+'.PDF';
			console.log("asking for",url);
			let pdfParser = new PDFParser(this,1);
			pdfParser.on("pdfParser_dataError", errData => {
				console.error(errData.parserError);
				setTimeout(()=>{
					getData(date.add(1,'days'),1);
				},4000)
			});
			pdfParser.on("pdfParser_dataReady", async pdfData => {
				let textToSave =pdfParser.getRawTextContent();
				let words = await db.getKeywords();
				db.saveText(textToSave, date.format('YYYYMMDD') + '-' + index, date.format('YYYY-MM-DD'), url).then((e)=>{
					console.log("bocm save correctly",e + " "+ date.format('YYYYMMDD') + '-' + index);
				});
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
getData(dateInit,1);
