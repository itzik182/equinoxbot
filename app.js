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
const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;



// Imports dependencies and set up http server
const
  feed = require('feed-read'),
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  FB = require('fb'),
  app = express().use(body_parser.json()); // creates express http server

  FB.setAccessToken(PAGE_ACCESS_TOKEN); 

var eventData = {
        "id" : 142175346457096,
        "start_time" : Math.round(new Date().getTime()/1000.0), //'2011-04-01T14:00:00+0000',
        "end_time": Math.round(new Date().getTime()/1000.0)+100, //'2011-05-01T14:00:00+0000',
        "location" : 'location',
        "name" : 'This is a new event',
        "description":'This is a new event222',
        "privacy":"OPEN"
    }

FB.api('https://graph.facebook.com/v2.6/me/events', 'GET', eventData, function (response) { //395404170913985
      //console.log("response - " + JSON.stringify(response));
 });
 
var graphapi = request.defaults({
    baseUrl: 'https://graph.facebook.com',
    json: true, 
    auth: {
        'bearer' : PAGE_ACCESS_TOKEN
    }
});

//--------
// graphapi({ 
//     url: '/activities',
//     method: 'POST',
//     form: {
//     event: 'CUSTOM_APP_EVENTS',
//     custom_events: JSON.stringify([{
//       _eventName: "fb_mobile_purchase",
//       _valueToSum: 55.22,
//       _fb_currency: 'USD'
//     }]),
//     advertiser_tracking_enabled: 0,
//     application_tracking_enabled: 0,
//     extinfo: JSON.stringify(['mb1']),
//     page_id: '395404170913985',
//     page_scoped_user_id: '100022693691284'
//   }
// }, function(err,httpResponse,body) {
//     console.log(err);
//    console.log(httpResponse.statusCode); 
//    console.log(body);
// });

request.post({ 
  url : "https://graph.facebook.com/853549721475416/activities",
  form: {
    event: 'CUSTOM_APP_EVENTS',
    custom_events: JSON.stringify([{
      _eventName: "fb_mobile_purchase1123",
      _valueToSum: 55.22,
      _fb_currency: 'USD'
    }]),
    advertiser_tracking_enabled: 0,
    application_tracking_enabled: 0,
    //extinfo: JSON.stringify(['mb1']),
    page_id: '395404170913985',
    page_scoped_user_id: '100022693691284'
  }
}, function(err,httpResponse,body){ 
  console.log(err);
  console.log(httpResponse.statusCode);
  console.log(body);
});
//-------


function getRecipients (received_message) {
  return new Promise((resolve, reject) => {
    var inviteEmails = [];
    var recipients = []; 
    var substring_message = received_message.substring(received_message.indexOf("#") + 1, received_message.length);
    if (substring_message.indexOf(";") !== -1) {
      inviteEmails = substring_message.split(";");
    } else {
      inviteEmails.push(substring_message);
    } 
    console.log("inviteEmails: " + JSON.stringify(inviteEmails));
    if (inviteEmails.length > 0) {
      let batch = [];
      inviteEmails.forEach(function(inviteEmail) {
        batch.push({ method: 'GET', relative_url: inviteEmail + '?fields=id,email,name,primary_phone,department'});
      });

      FB.api('/', 'POST', {
         include_headers: false,
         batch: batch
       }, function (response) {
          if (response.length > 0) {
            response.forEach(function(recipient) {
              recipients.push(JSON.parse(recipient.body));
            });
            resolve(recipients);
          }
       });
    }
  });
}

function sendMessage(recipients, received_message, thread_key, text) {
  let quick_replies;
  var primary_phone;
  var VR;
  var defaultVR = '9200167';
  graphapi({
      method: 'GET',
      url: '/' + recipients[0].id + '?fields=email,name,primary_phone,department',
  },function(error,response,body) {
    if(error) {
        console.error(error);
    } else {
      VR = body.department ? body.department : defaultVR;
      if (body.primary_phone) {
        primary_phone = body.primary_phone.replace('+', '');
      }
      console.log("body - " + JSON.stringify(body));
      //console.log("response - " + JSON.stringify(response));
    }

    switch(received_message.toLowerCase()) {
    case 'lets meet': case 'meet': case 'discuss': case 'brainstorm':
        text = 'May I suggest you enter your virtual room: https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        break;
    case 'link to my virtual room':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        break;
    case 'tamar': case 'link to tamar':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        break;
    case 'guy': case 'link to guy':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        break;
    case "Let's have a meeting": case 'Lets have a meeting':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        break;
    case 'buttons':
        text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
        buttons:[
          {
            "type":"web_url",
            "url":"https://avayaequinoxmeetings.com/scopia/mt/9022?ID=" + VR,
            "title":"Link to guy vr",
            "webview_height_ratio": "full",
            "messenger_extensions": true,  
            "fallback_url": "https://petersfancyapparel.com/fallback"
          }
        ]
        break;
    case '_letsa meet':
        text = 'Which virtual room?';
        quick_replies = [
            {
              //"type": "postback",
              "content_type":"text",
              "title":"Itzik",
              //"image_url":"http://example.com/img/red.png",
              "payload":"yes"
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
        text = 'https://rnd-10-134-86-27.holonlab.avaya.com:8443/portal/tenants/default/?ID=' + VR;
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

    if(received_message.includes("meet") || received_message.includes("discuss") || received_message.includes("brainstorm") || received_message.includes("meeting")){
      text = 'May I suggest you enter your virtual room: https://alphaconfportal.avaya.com:8443/portal/tenants/default/?ID=' + VR;
    }

    //if (received_message.text === 'lets meet') {    
    //  text = 'https://rnd-10-134-86-27.holonlab.avaya.com:8443/portal/tenants/default/?ID=661236';
    //}
    //else {
    //  text = 'You sent the message: "${received_message.text}". Now send me an image111!';
    //}
    //console.log("text556 - " + text);
    // Create the payload for a basic text message
    response = {
      "text": text,
      //"buttons": buttons,
      "quick_replies": quick_replies
    }

    // Sends the response message
    callSendAPI(recipients, response, thread_key);  
  }); 
}

// Handles messages events
function handleMessage(recipients, received_message, thread_key) {  
  let response;
  let text;
  let buttons;
  // Check if the message contains text
  if (received_message) {
    console.log('received_message- ' + received_message);
    
    if (received_message.indexOf("virtual room") !== -1 && received_message.indexOf("#") !== -1) {
      getRecipients(received_message).then(
        function (response) {
          if (response && response.length > 0) {
            let user = response[0];
            console.log("Success!", response);
            if (user && user.department) {
              text = 'The virtual room of ' + user.name + ' is ' + user.department;
            } else {
              text = 'The user ' + user.name + ' does not have a virtual room';
            }
            // Sends the response message
            callSendAPI(recipients, { "text": text }, thread_key);
          } else {
            console.error("error failed!");
          }
      });
    } else if (received_message.indexOf("equinox meeting") !== -1 && received_message.indexOf("#") !== -1) {
      console.log("equinox meeting # recipients1-" + JSON.stringify(recipients));
      getRecipients(received_message).then(
      function (response) {
        console.log("Success!", response);
        console.log("equinox meeting # a1- " + JSON.stringify(response));
        if (response !== undefined && response !== null) {
          console.log("equinox meeting # recipients2-" + JSON.stringify(recipients));
          recipients = recipients.concat(response);
          sendMessage(recipients, received_message, thread_key, text);
        }
        console.log("equinox meeting # recipients4-" + JSON.stringify(recipients));
      }, function (error) {
          console.error("Failed!", error);
      });
    } else {
       sendMessage(recipients, received_message, thread_key, text); 
    }
  };  
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  //console.log("payload - " + received_postback.quick_reply.payload);
  //handleMessage(sender_psid, received_postback.payload);
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.quick_reply.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(recipients, response, thread_key) {
  console.log("recipients - : " + JSON.stringify(recipients));
  recipients.forEach(function(recipient) {
  //displayTheTypingBubble(sender, response, thread_key);
  let request_body;
  //for(var sender in sender_psid) {
    console.log('thread_key: ' + thread_key);
    // Construct the message body
    if (thread_key && thread_key !== undefined && thread_key !== null) {
      request_body = {
      "recipient": {
        "thread_key": thread_key,
      },
      "message": response
      }
    } else {
     request_body = {
      "recipient": {
        "id": recipient.id,
      },
      "message": response
      } 
    }
    
    console.log("request_body: " + JSON.stringify(request_body));
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

function displayTheTypingBubble(sender, response, thread_key) {
  let request_body = {
      "recipient": {
        "id": sender.id
      },
      "sender_action": "typing_on"
    }
  //console.log("request_body: " + JSON.stringify(request_body));
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6",
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
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
console.log('req.body - ' + JSON.stringify(req.body));
  // Parse the request body from the POST
  let body = req.body;
  let sender_psid = new Array();
  // Check the webhook event is from a Page subscription
  if (body.object === 'page' || body.object === 'group') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
        if (entry && entry.changes && entry.changes.length > 0) {
          entry.changes.forEach(function(change) {
            console.log("change: " + JSON.stringify(change));
            let value = change.value;
            if (value.verb !== 'delete') {
              if (body.object === 'group' && value.from) {
                sender_psid.push({"id": value.from.id});
              } else {
                sender_psid.push({"id": value.sender_id});
              } 
              let message = value.message;
              if (value.message_tags) {
                value.message_tags.forEach(function(tag) {
                  if (tag.type === "user")
                  sender_psid.push({"id": tag.id});
                });
                let messages = message.split(' ');

                for(var i = value.message_tags.length; i < messages.length; i++) {
                  message = messages[i] + " ";
                }
              }
              
              let mention_id = (change.field === 'comments') ?
                            value.comment_id : value.post_id;
              
              
              if(value.from.category === undefined || (value.from.category !== undefined && value.from.category !== 'Bot')) {
                // Comment reply
                graphapi({ 
                    url: '/' + mention_id + '/comments',
                    method: 'POST',
                    qs: {
                        message: 'Thanks'
                    }
                }, function(error,res,body) {
                    console.log('Comment reply', mention_id);
                });

                if(message.toLowerCase() === 'thanks') {
                  // Like the post or comment to indicate acknowledgement
                  graphapi({
                      url: '/' + mention_id + '/likes',
                      method: 'POST'
                  }, function(error,res,body) {
                      console.log('Like', mention_id);
                  });   
                }
              }

              //console.log("sender2 - " + sender_psid);
              console.log("message - " + message);
              if (message) {
                handleMessage(sender_psid, message.trim());  
              }
            }
          });
        }

        //return;
        // Get the webhook event. entry.messaging is an array, but 
        // will only ever contain one event, so we get index 0
        if (entry && entry.messaging && entry.messaging.length > 0) {

          let webhook_event = entry.messaging[0];
          console.log("entry.messaging: " + JSON.stringify(webhook_event));
          // Get the sender PSID
          
          
          /*24/12/17*/
          sender_psid.push({"id": webhook_event.sender.id});
          //console.log("community id: " + entry.messaging[0].sender.community.id);
          //sender_psid.push({"id": entry.messaging[0].sender.community.id});
          
          //sender_psid.push({"id": entry.id});
          let thread_key;

          //let sender = get_sender_profile(sender_psid);
          console.log("sender - " + JSON.stringify(sender_psid));

          if (webhook_event.thread && webhook_event.thread.id) {
             thread_key = webhook_event.thread.id;
          }

          //console.log('Sender PSID: ' + sender_psid);
          //console.log('webhook_event: ' + webhook_event);

          // Check if the event is a message or postback and
          // pass the event to the appropriate handler function
          //console.log(webhook_event.message.quick_reply);
          if (webhook_event.message && webhook_event.message.text && webhook_event.message.quick_reply === undefined) {
            console.log('handleMessage: ' + JSON.stringify(webhook_event.message));
            handleMessage(sender_psid, webhook_event.message.text, thread_key);        
          } else if (webhook_event.postback) {
            console.log('handlePostback: ' + JSON.stringify(webhook_event.postback));
            handlePostback(sender_psid, webhook_event.postback);
          } else if (webhook_event.message && webhook_event.message.quick_reply) {
            console.log('handlePostback: ' + JSON.stringify(webhook_event.message));
            handlePostback(sender_psid, webhook_event.message);
          }
        }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  }  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  //console.log('get');
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
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