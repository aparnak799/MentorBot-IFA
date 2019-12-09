// const express = require('express');
// var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// const dialogflow = require('dialogflow');
// const uuid = require('uuid');
// var app = express();
// const io = require('socket.io');
// const http = require('http');
// var server = http.createServer(app);

const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dialogflow = require('dialogflow');
const uuid = require('uuid');


const internModels = require('./internModels');
const coursesModels = require('./coursesModels');

async function connectToMongoDb () {
    await mongoose.connect("mongodb://127.0.0.1:27017:/MentorBot",{
        useNewUrlParser:true,
        useCreateIndex: true,
         useUnifiedTopology: true 
    });
    console.log("Connected");
}

//var app = express();
var PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());                 //Parsing incoming JSON to objects so that we can access it usinng 'dot operator'


// Route

// app.get('/',async(req,res) => {

//   res.send('Chat Server is running on port 5000')
// });
io.on('connection', (socket) => {

console.log('user connected')

socket.on('join', function(userNickname) {

        console.log(userNickname +" : has joined the chat "  );

        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    });


socket.on('messagedetection', (senderNickname,messageContent) => {
       
       //log the message in console 

       console.log(senderNickname+" :" +messageContent)
        //create a message object 
       
          // send the message to the client side 

        var x = runSample(messageContent); //async function
    
        let  message = {"message":x, "senderNickname":senderNickname};
      
        console.log(message);
       io.emit('message', message );
     
      });
      
  
 socket.on('disconnect', function() {
    console.log( ' user has left ')
    socket.broadcast.emit("userdisconnect"," user has left ") 

});


});

async function runSample(queryText,projectId = 'test-mfqxln') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  var query = queryText;

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  var x;
  var a;

  if (result.intent.displayName === "Subject") {
    // var q = new RegExp(query, 'gi');
    coursesModels.find({title: {$eq: query}}).then((docs)=>{
      //res.send(docs);
      console.log("Course Details:",docs);
      a = docs[0].link
      x =JSON.stringify(a);
      //x = JSON.stringify(docs);
      // x = JSON.stringify(docs.title);
      console.log(x);
    }).catch((err)=>{
      console.log(err);
      //res.send(err);
    });
  
  } else if(result.intent.displayName === "Internships") {
    internModels.find({title: { $eq: "app developer" }}).then((docs)=>{
      //res.send(docs);
      //console.log("Internship Details:",docs);
      a = docs[0].link;
      x =JSON.stringify(a);
      console.log(x);
    }).catch((err)=>{
      //res.send(err);
      console.log(err);
    });
  }
  else{
    return result.fulfillmentText;
  }
}


server.listen(PORT,(req,res)=>{
    console.log("Server is up & running on",PORT);
})

async function main(){
  await connectToMongoDb();

}

main();