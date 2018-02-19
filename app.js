/*
 * Development App for the OneHealth Chatbot in Facebook Messenger
 *
 */

'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

var databaseInit = require('./databaseInit');
const db = databaseInit.db;

var statesInit = require('./statesInit');
const states = statesInit.states;
const responses = statesInit.responses;
const nextStates = statesInit.nextStates;
const statesWithPostbacks = statesInit.statesWithPostbacks;
const statesWithNLP = statesInit.statesWithNLP;



// Sets server port and logs message on success
var listener = app.listen(process.env.PORT || 1337, () => console.log('Your app is listening on port ' + listener.address().port));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      
      // Query user data from the database
      let db_user = db.get('users').find({ sender_psid: sender_psid });
      let currentState;
      if (db_user.value() !== undefined){
        currentState = db_user.value()['currentState'];
      }
      
      

      // If current question is in the list of questions that require postbacks as response.
      if (statesWithPostbacks.indexOf(currentState) > -1) {
        // Ensure that the user response is a postback; otherwise, do nothing.
        if (webhook_event.postback) {
          handleResponses(sender_psid, db_user, webhook_event.postback);
        }
      }
      // If current question does not require buttons (i.e. quick replies, messages, and attachments)
      // First time users (so currentState is undefined) won't require postbacks, so an initial text message or a "Get Started" button will fall under here
      else {
        // Ensure that the user response is a message; otherwise, do nothing.
        if (webhook_event.message) {
          handleResponses(sender_psid, db_user, webhook_event.message);      
        } 
        // If the "Get Started" button was pressed.
        else if ((webhook_event.postback)  && (webhook_event.postback.payload === 'GET_STARTED_PAYLOAD')) {
          handleResponses(sender_psid, db_user, webhook_event.postback);
        }
      }
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "VERIFYTOKEN";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});



// Handles all response events
function handleResponses(sender_psid, db_user, received_message) {
  let response;
  let answer;
  let currentState;
  let nextCurrentState;
  
  // Check if the type of message received (quick_reply, text, attachment, or payload)
  if (received_message.quick_reply) { 
    //Quick reply types also have received_message.text in the last attribute, so let us put this condition first.
    answer = received_message.quick_reply.payload;
  }
  else if (received_message.text) { 
    answer = received_message.text;
  }
  else if (received_message.attachments) { 
    answer = received_message.attachments[0].payload.url;
  }
  else if (received_message.payload) { 
    answer = received_message.payload;
  }
  
  
  
  // First time messaging the app
  if (db_user.value() === undefined) {
      console.log("FIRST TIME USER");
      
      //Get facebook name of user... perform initial save in DB
      getProfileInfo(sender_psid, function(response){
        db.get('users')
          .push({ sender_psid: sender_psid, facebook_name: response.first_name + ' ' + response.last_name, currentState: states.consent_message })
          .write()
      });

      nextCurrentState = states.consent_message;
  } 
  // Second or more time messaging the app
  else {
      console.log("USER ALREADY DEFINED IN DB");
      console.log("currently in state: " + db_user.value()['currentState']);
      currentState = db_user.value()['currentState'];
      nextCurrentState = nextStates[currentState];

      // If the next state has multiple possible choices (represented by object), not just a single path (w/c is represented by a string).
      if(typeof nextCurrentState === "object") {
        // Get the next state depending on the user's answer
        nextCurrentState = nextStates[currentState][answer];
        
        /*
        v0.0.2: This is now working as NLP app from Wit.AI is now added.
        v0.0.1: The assignment above would only work if answer is from a payload/button.
        The next states based on the button answers are pre-defined above.
        What if the answer is a free text? In this case NLP *might* melp.
        */
        if (currentState in statesWithNLP) {

          //since NLP is turned on for the whole app, this will always return true, as messages will always have the nlp object.
          if(received_message.nlp) {
            //statesWithNLP[currentState] should get the corresponding Wit.AI entity for that question, defined in statesInit.js
            const feedback = getNLPEntity(received_message.nlp, statesWithNLP[currentState]);
            console.log('returned from NLP: ' + JSON.stringify(feedback));

            //If there was a result!
            if (feedback && feedback.confidence > 0.5) {//keep the confidence threshold at an arbitrary 0.5 for now
              nextCurrentState = nextStates[currentState][feedback.value];
              console.log('feedback value: ' + feedback.value);
            } else {
              //It is important to define a default next state for every NLP question.
              nextCurrentState = nextStates[currentState]['default'];
            }
          }
        }
        
    
        /*If a next state doesn't exist for that answer 
        (e.g. could be another button from a previous question, a text but requiring quick reply, or a mishandled NLP), repeat the question*/
        if (nextCurrentState === undefined) {
           nextCurrentState = currentState;
        }
      }

      // Store the answer and update the state
      db.get('users')
        .find({ sender_psid: sender_psid })
        .assign({ sender_psid: sender_psid, 
                 currentState: nextCurrentState,
                 [currentState]: answer
                })
        .write()
  }
  
  // Todo: If the next response needs additional processing based from the answer (e.g. for NLP), make the responses as functions.
  response = responses[nextCurrentState];
  
  // Sends the response message
  callSendAPI(sender_psid, response);  
}



// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
  setSendAction(sender_psid);
  
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
  
}

function setSendAction(sender_psid) {
  //This sets the dot dot dot animation before sending the message

  let send_action = {
    "recipient":{
      "id":sender_psid
    },"sender_action":"typing_on"
  }
  
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": send_action
  }, (err, res, body) => {
    if (!err) {
      console.log('<send action (...) sent>')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

// Get Profile Info for first time users
function getProfileInfo(sender_psid, callback) {
    
  let usersPublicProfile = 'https://graph.facebook.com/v2.6/' + sender_psid + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + PAGE_ACCESS_TOKEN;
  let x = request({
      url: usersPublicProfile,
      json: true // parse
  }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("Profile Info: " + JSON.stringify(body));
          return callback(body);
        } else {
          console.error("Unable to get profile info: " + error);
        }
    
  });
}

//NLP Function
function getNLPEntity(nlp, name) {
  console.log('NLP: ' + JSON.stringify(nlp));
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}
