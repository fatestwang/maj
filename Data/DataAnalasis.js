const fs = require('fs');
let xml2js = require('xml2js');
let parser = new xml2js.Parser();

let fileList = fs.readdirSync('./');

for(let file of fileList){
    if(file.slice(13, 17) == '00a9'){
        fs.readFile('./'+ file, (err,data)=>{
            console.log(err, data);
            parser.parseString(data, (err, result)=>{
                console.log(result);
                console.log('Done');
            });
        })
    }
}