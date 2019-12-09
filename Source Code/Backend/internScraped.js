var request = require('request-promise');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

const internModels = require('./internModels');


async function connectToMongoDb () {
    await mongoose.connect("mongodb://127.0.0.1:27017:/MentorBot",{
        useNewUrlParser:true,
        useCreateIndex: true,
         useUnifiedTopology: true 
    });
    console.log("Connected");
}

async function internsScraped () {

var newUrl = 'https://www.hellointern.com/'
var initalUrl = 'https://www.hellointern.com/search'

var first;
var ans = [];
var ans1 = [];
request(initalUrl, async function (err, resp, body) {
     $ = cheerio.load(body);
    
     for (var i = 1; i <= 50 ; i++) { 
        
        first = $('#listings tbody tr:nth-child(' + i + ') td.title_salary span.title_span a');
        $(first).each(async (k, firsts) => {
           //remove space, to lower
            ans.push($(firsts).text());
            ans1.push(newUrl+$(firsts).attr('href'));
            console.log(ans);
            console.log(ans1);
        })
          
     }

     for(var i=0;i<ans.length; i++){
        var InternModels = new internModels({
            title:ans[i],
            link:ans1[i]
        });
        await InternModels.save().then(
            (doc)=>{console.log(doc);},
            (err)=>{console.log(err);}
        );
    }
    });
}   

async function main(){
    await connectToMongoDb();
    await internsScraped();
}

main();
