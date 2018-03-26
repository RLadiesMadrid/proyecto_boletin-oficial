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
				findInText(textToSave,words,e.insertId);
				console.log("save data correctly",date.format('YYYY-MM-DD'))
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
function findInText(text,words,textid) {
		words.forEach((w)=>{
			let count = (text.match(new RegExp(w.keyword,'g')) || []).length;
			// console.log(w);
			db.saveTextKeyword(textid,w.id,count)
		})
}
getData(dateInit,1);
