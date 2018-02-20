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

// GET event fields:
FB.api('/583221065350500?fields=description,name,owner,parent_group,place,start_time,attending,maybe,interested,noreply,comments' , 'GET', function (response) {
      //console.log("events response4 - " + JSON.stringify(response)); 
 });
 
var graphapi = request.defaults({ 
    baseUrl: 'https://graph.facebook.com',
    json: true, 
    auth: {
        'bearer' : PAGE_ACCESS_TOKEN
    }
});

graphapi({
        method: 'GET',
        url: '/' + '?fields=name',
    },function(error,response,body) {
      if(error) {
        console.error("getEmployeeDetailsByIdOrEmail=> error - " + error);
      } else { 
        console.log("getEmployeeDetailsByIdOrEmail=> body - " + JSON.stringify(body));
      }
    });


function getRecipients (recipientsList) {
  console.log("getRecipients - recipientsList: " + recipientsList);
  return new Promise((resolve, reject) => {
    var inviteEmails = [];
    var recipients = []; 
    
    if (recipientsList.indexOf(";") !== -1) {
      inviteEmails = recipientsList.split(";");
    } else {
      if (recipientsList.indexOf("@") === -1) {
        recipientsList = recipientsList + '@avaya.com';
      } 
      inviteEmails.push(recipientsList);
    } 
    console.log("inviteEmails: " + JSON.stringify(inviteEmails));
    if (inviteEmails.length > 0) {
      let batch = [];
      inviteEmails.forEach(function(inviteEmail) {
        if (inviteEmail.indexOf("@") === -1) {
          inviteEmail = inviteEmail + '@avaya.com';
        }
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

function getEmployeeDetailsByIdOrEmail(userIdentify, fields) {
  return new Promise((resolve, reject) => {
    graphapi({
        method: 'GET',
        url: '/' + userIdentify + '?fields=' + fields,
    },function(error,response,body) {
      if(error) {
        console.error("getEmployeeDetailsByIdOrEmail=> error - " + error);
        reject(error);
      } else {
        resolve(body);
        console.log("getEmployeeDetailsByIdOrEmail=> body - " + JSON.stringify(body));
      }
    });
  });
}

function getTextMessageResponse(received_message, user) {
  let primary_phone;
  let VR = user.department ? user.department : '9200167';
  
    if (user.primary_phone) {
      primary_phone = user.primary_phone.replace('+', '');
    }
  
  var text = '';
  switch(received_message.toLowerCase()) {
    case '@join': case 'link to my virtual room': case 'Lets have a meeting':
        text = 'May I suggest you enter your virtual room: https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
        break;
    case '@invite':
        text = user.name + ' suggest you meet at: https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
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
    }
  
    return text;
}

function sendMessage(recipients, received_message, thread_key, text) {
  console.log('sendMessage - received_message- ' + received_message);
  let quick_replies;
  
  getEmployeeDetailsByIdOrEmail(recipients[0].id, 'email,name,primary_phone,department').then(function (response) {
    console.log("response - " + JSON.stringify(response));
    text = getTextMessageResponse(received_message, response);
    var responseObj = {
      "text": text,
      //"buttons": buttons,
      "quick_replies": quick_replies
    }

    // Sends the responseObj message
    callSendAPI(recipients, responseObj, thread_key);
    
  },function(error) {
      console.error(error);
  }); 
}

// Handles messages events
function handleMessage(recipients, received_message, thread_key) {  
  let response;
  let text;
  let buttons;
  // Check if the message contains text
  if (received_message) {
    console.log('handleMessage - received_message- ' + received_message);
    var recipientsList;
    if (received_message.indexOf("@where") !== -1) {
      recipientsList = received_message.substring(received_message.indexOf(" ") + 1, received_message.length);
      console.log("recipientsList - " + recipientsList);
      
      getRecipients(recipientsList).then(
        function (response) {
          if (response && response.length > 0) {
            let user = response[0];
            console.log("Success!", response);
            if (user && user.department) {
              text = 'The virtual room of ' + user.name + ' is https://meetings.avaya.com/portal/tenants/9022/?ID=' + user.department;
            } else {
              text = 'The user ' + user.name + ' does not have a virtual room';
            }
            // Sends the response message
            callSendAPI(recipients, { "text": text }, thread_key);
          } else {
            console.error("error failed!");
          }
      });
    } else if (received_message.indexOf("@invite") !== -1) {
      console.log("equinox meeting # recipients1- " + JSON.stringify(recipients));
      
      recipientsList = received_message.substring(received_message.indexOf(" ") + 1, received_message.length);
      console.log("recipientsList - " + recipientsList);
      
      getRecipients(recipientsList).then(
      function (response) {
        console.log("Success!", response);
        console.log("equinox meeting # a1- " + JSON.stringify(response));
        if (response !== undefined && response !== null) {
          console.log("equinox meeting # recipients2-" + JSON.stringify(recipients));
          //recipients = recipients.concat(response);
          let isRecipients = false;
          response.forEach(function(recipient) {
            if (!recipient.error) {
              recipients.push(recipient);
              isRecipients = true;
            }
          });
          if (isRecipients) {
            var substring_message = received_message.substring(0, received_message.indexOf(" "));
            sendMessage(recipients, substring_message, thread_key, text);
          } else {
            console.log('recipients222222 - ' + recipients);
            callSendAPI(recipients, { "text": 'This user does not exist' }, thread_key);
          }          
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
  
  console.log("body.object: " + body.object);
  
  // Check the webhook event is from a Page subscription
  if (body.object === 'page' || body.object === 'group' || body.object === 'user') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
        if (entry && entry.changes && entry.changes.length > 0) {
          entry.changes.forEach(function(change) {
            console.log("change: " + JSON.stringify(change));
            let value = change.value;
            let message = value.message;
            
            if (body.object === 'user' && message !== '@join') {
             return;
            }
            
            if (value.verb !== 'delete') {
              if (body.object === 'group' && value.from) {
                sender_psid.push({"id": value.from.id});
              } else {
                sender_psid.push({"id": value.sender_id});
              }
              
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
              var isEvent = false;
              if(value && value.type === 'event' && value.verb === 'add') {
                isEvent = true;
                if(value.message.indexOf('@live') !== -1) {
                  getEmployeeDetailsByIdOrEmail(value.from.id, 'department').then(function (response) {
                   var meetingUrl = response.department ? 
                       'https://meetings.avaya.com/portal/tenants/9022/?ID=' + response.department : 'https://meetings.avaya.com/portal/tenants/9022/?ID=90397237679607';
                    //if(VR !== null) {
                    let eventUrl = value.attachments.data[0].url;
                    var eventId = eventUrl.substring(eventUrl.indexOf("events/") + 7, eventUrl.length -1);
                    console.log('eventId', eventId);
                     graphapi({
                       url: '/' + eventId + '/feed',
                      //url: '/' + value.post_id + '/comments',
                      //url: '/142481733216767/feed',
                      method: 'POST',
                      qs: {
                          message: 'The meeting url is: ' + meetingUrl,
                          //timeline_visibility: 'starred'
                      }
                     }, function(error,res,body) {
                        console.log('event feed', response.department);
                     });
                     graphapi({
                      url: '/' + value.post_id + '/comments',
                      method: 'POST',
                      qs: {
                          message: 'The meeting url is: ' + meetingUrl
                      }
                     }, function(error,res,body) {
                        console.log('event comments', response.department);
                     });
                    //}
                  }, function (error) {
                    console.error("Failed!", error);
                  });
                }
              } else {
                let mention_id = (change.field === 'comments') ?
                              value.comment_id : value.post_id;

                console.log('Comment reply', mention_id);
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
              }
              //console.log("sender2 - " + sender_psid);
              console.log("message - " + message);
              if (message && !isEvent) {
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