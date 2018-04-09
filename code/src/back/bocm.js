const request = require('request');
const fs = require('fs');
const PDFParser = require("pdf2json");
const moment = require('moment');
let dateInit = moment("2017-10-04");
let dateEnd = moment();
const db = require('./db');
const seconds = 7000;

function getData(date,index){
	if (date < dateEnd){
		try{
		const url = 'https://www.bocm.es/boletin/CM_Orden_BOCM/'+date.format('YYYY/MM/DD') + '/BOCM-'+date.format('YYYYMMDD') + '-'+index+'.PDF';
		console.log("asking for",url);
		let pdfParser = new PDFParser(this,1);
		pdfParser.on("pdfParser_dataError", errData => {
			console.error(errData.parserError);
            setLastDate({date:date.format('YYYY-MM-DD'),index:index});
			setTimeout(()=>{
				getData(date.add(1,'days'),1);
			},seconds)
		});
		pdfParser.on("pdfParser_dataReady", async pdfData => {
			let textToSave =pdfParser.getRawTextContent();
			db.saveText(textToSave, date.format('YYYYMMDD') + '-' + index, date.format('YYYY-MM-DD'), url).then((e)=>{
				console.log("save data correctly",date.format('YYYY-MM-DD'));
				setLastDate({date:date.format('YYYY-MM-DD'),index:index})
			});
			setTimeout(()=>{
				index++;
				getData(date,index);
			},seconds)
		});
		request({url: url, encoding:null})
			.on('error', (err)=> {
                setLastDate({date:date.format('YYYY-MM-DD'),index:index});
                setTimeout(()=>{getData(date,index);},seconds);
				console.log("error",err);
			}).pipe(pdfParser);
		} catch (err) {
			setTimeout(()=>{getData(date,index);},seconds)
		}
	}
}

getLastDate = ()=> {
    return new Promise((resolve,reject)=>{
        fs.readFile('lastDate', (err,data) => {
            if (err) {
                return resolve({date:dateInit,index:1});
            }
            console.log("soy los datos",data);
            return resolve(JSON.parse(data));
        });
	})
};
setLastDate = (data) =>{
	fs.writeFile('lastDate',JSON.stringify(data),(err)=>{
		if (err) return 'error';
		return 'saved';
	})
};

getLastDate().then((lastDate)=>{
    getData(moment(lastDate.date),lastDate.index);
});
