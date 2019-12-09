var request = require('request');
var cheerio = require('cheerio');
var searchTerm = 'machine learning';

var request = require('request-promise');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

const coursesModels = require('./coursesModels');


async function connectToMongoDb () {
    await mongoose.connect("mongodb://127.0.0.1:27017:/MentorBot",{
        useNewUrlParser:true,
        useCreateIndex: true,
        useUnifiedTopology: true 
    });
    console.log("Connected");
}

async function coursesScraped() {

//************************Initial URL appending**********************************/
var initalUrl = 'https://digitaldefynd.com/?s='+searchTerm;

request(initalUrl,async function (err, resp, body) {
  $ = cheerio.load(body);
  link = $('header.entry-header h2.entry-title a');
  
  //*************Catching the URL and progressing further************/

  var url = $(link).attr('href');
  
  
  request(url,async function (err, resp, body) {
    $ = cheerio.load(body);
    links = $('div.clearfix div.article-content div.entry-content h3 span a');                    //jquery get all hyperlinks
    ratings = $('div.clearfix div.article-content div.entry-content p strong:contains(Rating)');

    //************************Printing all Course Links*************** */
    var courseName = [];
    var courseLink = [];
    $(links).each(function (i, link) {
      courseName.push($(link).text());
      courseLink.push($(link).attr('href'));
      return courseName,courseLink;
    });
  
    //***************************Printing all Ratings*******************************************/
    var courseRating = [];
    $(ratings).each(function (i, rating) {

      courseRating.push($(rating).text());
      return courseRating;
    });

    //********************************Saving into a Database**************************/
for(var i=0;i<3; i++){
  var CoursesModels = new coursesModels({
      title:courseName[i],
      link:courseLink[i],
      rating:courseRating[i]
  });
  await CoursesModels.save().then(
      (doc)=>{console.log(doc);},
      (err)=>{console.log(err);}
      );
    };
  });
});
};

async function main(){
  await connectToMongoDb();
  await coursesScraped();
}

main();
   
   


