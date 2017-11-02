/*
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Remix this as the starting point for following the Messenger Platform
 * quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 * group
 */

'use strict';
const PAGE_ACCESS_TOKEN = "DQVJ0SkQzOWRQdE03clJsSnNxT1Y5WUF2UmxmZAmdScDdGTVRBNC1nY042S0REbm1USmxNVnVHWkVPZAmhrbDVEM0tVdEpJTmRIRGMyT3dHY1p3cENhTVl0aFlQRHI5OHVoT3ZARRzZAJdkM4UWtmYjEtYkNsT3IwNmNQb0xpRFBMYkV3RVVnVnpGbFpvRWhOeTlzX3drdEZA6SllFN3FabGlTS0Ftck0tZAFpKRDV6SVA0TktuYlpPa0IybXNmMi10SmhKMUZASanZAhREhHMThRa2paOAZDZD";




// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Handles messages events
function handleMessage(sender_psid, received_message, thread_key) {
  let response;
  let text;
  let quick_replies;
  // Check if the message contains text
  if (received_message.text) {    
    console.log(received_message.text);
    
    switch(received_message.text.toLowerCase()) {
    case 'lets meet': case 'meet': case 'discuss': case 'brainstorm':
        text = 'May I suggest you enter your virtual room: https://avayaequinoxmeetings.com/scopia/mt/9022?ID=9200167';
        break;
    case 'link to my virtual room':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=9200167';
        break;
    case 'tamar': case 'link to tamar':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=9200167';
        break;
    case 'guy': case 'link to guy':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=9200167';
        break;
    case '_letsa meet':
        text = 'Which virtual room?';
        quick_replies = [
            {
              "content_type":"text",
              "title":"Itzik",
              //"image_url":"http://example.com/img/red.png",
              "payload":"lets meet itzik room"
            },
              {
              "content_type":"text",
              "title":"Ronny",
              //"image_url":"http://example.com/img/red.png",
              "payload":"<lets meet ronny room>"
            },
              {
              "content_type":"text",
              "title":"Anna",
              //"image_url":"http://example.com/img/red.png",
              "payload":"<lets meet anna room>"
            }
        ]
        break;
    case 'hi':
        text = 'Hello, Im EquinoxBot, How i can help you?';
        break;
    case 'have a nice day':
        text = 'You as well, thank you';
        break;
    case 'thank you': case 'thanks':
        text = 'You are welcome';
        break;
    case 'lets meet anna room':
        text = 'https://rnd-10-134-86-27.holonlab.avaya.com:8443/portal/tenants/default/?ID=661232';
        break;
    case 'location':
        text = "location";
        quick_replies = [
          {
            "content_type":"location"
          }
        ];
        break;
    //default:
    //    text = `You sent the message: "${received_message.text}".`;
    }
    
    if(received_message.text.includes("meet") || received_message.text.includes("discuss") || received_message.text.includes("brainstorm")){
      text = 'May I suggest you enter your virtual room: https://alphaconfportal.avaya.com:8443/portal/tenants/default/?ID=171197237679607';
    }
    
    //if (received_message.text === 'lets meet') {    
    //  text = 'https://rnd-10-134-86-27.holonlab.avaya.com:8443/portal/tenants/default/?ID=661236';
    //}
    //else {
    //  text = 'You sent the message: "${received_message.text}". Now send me an image111!';
    //}
    
    // Create the payload for a basic text message
    response = {
      "text": text,
      "quick_replies": quick_replies
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response, thread_key);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  console.log("payload - " + received_postback.payload);
  handleMessage(sender_psid, received_postback.payload);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response, thread_key) {
  
  // Construct the message body
  let request_body = {
    "to": {
      
    },
    "recipient": {
      "id": sender_psid
    },
    "recipient": {
      "id": '100022742164286'
    },
    "thread_key": {
      "id": thread_key
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
      //console.log('message sent!')
    } else {
      //console.error("Unable to send message:" + err);
    }
  }); 
  
  // Construct the message body
  let messenger_profile_request_body = {
    //"get_started": "hi",
    "greeting": [
    {
      "locale":"default",
      "text":"Hello {{user_full_name}}!",
      //"image_url":"https://rnd-10-134-https://rnd-10-134-86-27.holonlab.avaya.com/portal/custom-styles/999/custom_logo.svg86-27.holonlab.avaya.com/portal/custom-styles/999/custom_logo.svg",
      //"get_started": "hi"
    },
  ]
  }
  
  // Send the HTTP request to the messenger profile Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": messenger_profile_request_body
  }, (err, res, body) => {
    if (!err) {
      //console.log('message sent!')
    } else {
      //console.error("Unable to send message:" + err);
    }
  });
  
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
//console.log(req);
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      
      //for(var property in entry) {
      //  console.log(property + "=" + entry[property]);
        //for(var property1 in entry[property]) {
        //  console.log(property1 + "=" + entry[property][property1]);
        //}
      //}
      //console.log("entry: " + JSON.stringify(entry));
      console.log("send");
      if (entry && entry.changes && entry.changes.length > 0) {
        console.log("entry.changes: " + JSON.stringify(entry.changes[0]));
      }
      //return;
      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      if (entry && entry.messaging && entry.messaging.length > 0) {
      
        let webhook_event = entry.messaging[0];
        console.log("entry.messaging: " + JSON.stringify(webhook_event));
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        let thread_key;

        //let sender = get_sender_profile(sender_psid);
        //console.log("sender - " + sender);

        if (webhook_event.thread && webhook_event.thread.id) {
           thread_key = webhook_event.thread.id;
        }

        //console.log('Sender PSID: ' + sender_psid);
        //console.log('webhook_event: ' + webhook_event);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message && webhook_event.message.text) {
          //console.log('handleMessage: ' + webhook_event.message);
          handleMessage(sender_psid, webhook_event.message, thread_key);        
        } else if (webhook_event.postback) {
          console.log('handlePostback: ' + webhook_event.postback);
          handlePostback(sender_psid, webhook_event.postback);
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
  //console.log('get');
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "Avaya2011fffdfd343rer34r3ere";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      //console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function get_sender_profile(id) {
  request({
    "uri": "https://graph.facebook.com/v2.6/#{'+id+'}",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "GET",
    "fields": 'first_name,last_name,gender,profile_pic'
  }, (err, res, body) => {
    if (!err) {
      console.log(res)
    } else {
      //console.error("Unable to send message:" + err);
    }
  }); 
}