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

      db.get('users')
        .push({ sender_psid: sender_psid, currentState: states.question1 })
        .write()

      nextCurrentState = states.question1;
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
        
        /*This assignment would only work if answer is from a payload/button.
        The next states based on the button answers are pre-defined above.
        What if the answer is a free text? In this case NLP *might* melp.
        */
        
        /*In the meantime, if a next state doesn't exist for that answer 
        (e.g. could be another button from a previous question, or a text but requiring quick reply), repeat the question*/
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
  
  setSendAction();
  
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

function setSendAction() {
  //This sets the dot dot dot animation before sending the message

  let send_action = {
    "recipient":{
      "id":"1479553138810562"
    },"sender_action":"typing_on"
  }
  
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": send_action
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}