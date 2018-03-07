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
var fs = require('fs');

var table = require('./table.js');

console.log(table.getHello());

var avayaEmployees = require('./table.json');

//avayaEmployees.push({"name": "tamar222", "email": "tamarb222@avaya.com"});
//fs.writeFileSync('./table.json', JSON.stringify(avayaEmployees)); 

//console.log(avayaEmployees);

// Imports dependencies and set up http server
const
  feed = require('feed-read'),
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  FB = require('fb'),
  pageId = 0,
  app = express().use(body_parser.json()); // creates express http server

const accessTokens = {},

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

// graphapi({
//         method: 'GET',
//         url: '/' + '?fields=name',
//     },function(error,response,body) {
//       if(error) {
//         console.error("getEmployeeDetailsByIdOrEmail=> error - " + error);
//       } else { 
//         console.log("getEmployeeDetailsByIdOrEmail=> body - " + JSON.stringify(body));
//       }
// });

// graphapi({
//         method: 'GET',
//         url: '/v2.6/395404170913985',
//     },function(error,response,body) {
//       if(error) {
//         console.error("friends=> error - " + error); 
//       } else { 
//         console.log("friends=> body - " + JSON.stringify(body));
//       }
// });

displayMessengerProfile();

function getRecipients (recipientsList) {
  console.log("getRecipients - recipientsList: " + recipientsList);
  return new Promise((resolve, reject) => {
    var inviteEmails = [];
    var recipients = []; 
    
    if (recipientsList.indexOf(";") !== -1) {
      inviteEmails = recipientsList.split(";");
    } else {
      // if (recipientsList.indexOf("@") === -1) {
      //   recipientsList = recipientsList + '@avaya.com';
      // }
      inviteEmails.push(recipientsList);
    } 
    console.log("inviteEmails: " + JSON.stringify(inviteEmails)); 
    if (inviteEmails.length > 0) {
      let batch = [];
      inviteEmails.forEach(function(inviteEmail) {
        if(avayaEmployees) {
          var currentEmployees = avayaEmployees.filter(
            avayaEmployee => avayaEmployee && (avayaEmployee.name && avayaEmployee.name.toLowerCase().indexOf(inviteEmail.toLowerCase()) !== -1) || 
            (avayaEmployee.email && avayaEmployee.email.toLowerCase().indexOf(inviteEmail.toLowerCase()) !== -1)
          );
          console.log("currentEmployees: " + JSON.stringify(currentEmployees));
        
          if (currentEmployees && currentEmployees.length > 0) {
            if (currentEmployees && currentEmployees.length < 1) {
              inviteEmail = currentEmployees[0].email;
            } else {
             //Ask which one?
              inviteEmail = currentEmployees[0].email;
            }
          } else {
            if (inviteEmail.indexOf("@") === -1) {
              inviteEmail = inviteEmail + '@avaya.com';
            }
          }
        }
        batch.push({ method: 'GET', relative_url: inviteEmail + '?fields=id,email,name, first_name,primary_phone,department'});
      });

      FB.api('/', 'POST', {
         include_headers: false,
         batch: batch
       }, function (response) {
        if (!response || response.error) {
          reject(response.error);
        } else {
          if (response.length > 0) {
            response.forEach(function(recipient, index) {
              recipient = JSON.parse(recipient.body);
              recipient.searchName = inviteEmails[index];
              recipients.push(recipient);
              let currentEmployees = avayaEmployees.filter(
                avayaEmployee => avayaEmployee.email.indexOf(recipient.email) !== -1
              );
              console.log("avayaEmployees123: " + JSON.stringify(currentEmployees.length));
              console.log("avayaEmployees12344: " + JSON.stringify(recipient));
              if (currentEmployees.length <= 0 && (recipient && recipient.first_name && recipient.email)) {
                console.log("avayaEmployees456: " + JSON.stringify(avayaEmployees));
                avayaEmployees.push({"name": recipient.first_name.toLowerCase(), "email": recipient.email.toLowerCase()});
                console.log("avayaEmployees789: " + JSON.stringify(avayaEmployees));
                fs.writeFileSync('./table.json', JSON.stringify(avayaEmployees)); 
              }
            });
            resolve(recipients);
          }
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

function getButtons (title, text, url) {
 return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons": [
          {
            "type":"web_url",
            "url": url,
            "title": title
          }
        ]
      }
    }
  }; 
}

function getTextMessageResponse(received_message, user, isThread) {
  let primary_phone;
  let VR = user && user.department ? user.department : '9200167';
  
    if (user && user.primary_phone) { 
      primary_phone = user.primary_phone.replace('+', '');
    }
  var buttons = null,
      responseObj = null,
      title, 
      text, 
      url;
  switch(received_message.toLowerCase()) {
    case '@join': case 'link to my virtual room': case 'Lets have a meeting':
        if(isThread) {
          text = 'May I suggest you enter to virtual room: https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
        } else {
          title = 'Join meeting';
          text = 'May I suggest you enter to virtual room:';
          url = 'https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
          responseObj = getButtons(title, text, url);
        }
        break;
    case '@invite':
        if(isThread) {
          text = user.name + ' invite you a meeting at https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
        } else {
          title = 'Join meeting';
          text = user.name + ' is inviting you to a live meeting';
          url = 'https://meetings.avaya.com/portal/tenants/9022/?ID=' + VR;
          responseObj = getButtons(title, text, url);
        }
        break;
    case '@where':
        if (user && user.department) {
          text = 'Link to virtual room of ' + user.name;
          title = 'Enter to virtual room';
          url = 'https://meetings.avaya.com/portal/tenants/9022/?ID=' + user.department;
          responseObj = getButtons(title, text, url);
        } else {
          text = 'The user ' + user.name + ' does not have a virtual room';
        }
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
  
    if (responseObj === null) {
     responseObj = {"text": text};
    }
    console.log("getTextMessageResponse - responseObj - " + JSON.stringify(responseObj));
    return responseObj;
}

function sendMessage(recipients, received_message, thread_key) {
  console.log('sendMessage - received_message- ' + received_message);
  let quick_replies;
  var isThread = thread_key ? true : false;
  //TODO: check way recipients[0]?
  getEmployeeDetailsByIdOrEmail(recipients[0].id, 'email,name,primary_phone,department').then(function (response) {
    console.log("sendMessage - response - " + JSON.stringify(response));
    var responseObj = getTextMessageResponse(received_message, response, isThread);
    
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
  let url;
  var substring_message;
  var responseObj 
  var isThread = thread_key ? true : false;
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
          console.log("@where - response - " + JSON.stringify(response));
          if(response[0].error) {
            text = 'I did not find user named "' + recipientsList + '", please send "@where + email"';
            responseObj = {"text": text};
          } else {
            if (response && response.length > 0) {
              //let user = response[0];
              substring_message = received_message.substring(0, received_message.indexOf(" "));
              responseObj = getTextMessageResponse(substring_message, response[0], isThread);
            } else {
              console.error("error failed!");
            }
          }
          // Sends the response message
          callSendAPI(recipients, responseObj, thread_key);
      }, function(reason) {
        console.error("error failed! - " + reason);
      });
    } else if (received_message.indexOf("@invite") !== -1) {
      console.log("equinox meeting # recipients1- " + JSON.stringify(recipients));
      
      recipientsList = received_message.substring(received_message.indexOf(" ") + 1, received_message.length);
      console.log("recipientsList - " + recipientsList);
      
      getRecipients(recipientsList).then(
      function (response) {
        console.log("equinox meeting # a1- " + JSON.stringify(response));
        if (response !== undefined && response !== null) {
            console.log("equinox meeting # recipients2-" + JSON.stringify(recipients));
            //recipients = recipients.concat(response);
            response.forEach(function(recipient, index) {
              if (!recipient.error) {
                if(recipients[0] && recipients[0].id !== recipient.id && index === 0) {
                   recipients.push(recipient);
                }
                substring_message = received_message.substring(0, received_message.indexOf(" "));
                sendMessage(recipients, substring_message, thread_key);
                //responseObj = getTextMessageResponse(substring_message, response[0], isThread);
                //callSendAPI(recipients, responseObj, thread_key);
              } else {
                // var indexStart = recipient.error.message.indexOf('exist:') + 7 ;
                // var errorName = recipient.error.message.substr(indexStart, recipient.error.message.length);
                 console.log('recipients[0] - ' + JSON.stringify(recipients[0]));
                text = 'I did not find a user named "' + recipient.searchName + '", please send "@invite + email"';
                callSendAPI([recipients[0]], { "text": text }, thread_key); 
              }
            });
        }
        console.log("equinox meeting # recipients4-" + JSON.stringify(recipients));
      }, function (error) {
          console.error("Failed!", error);
      });
    } else {
       sendMessage(recipients, received_message, thread_key); 
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
  var originalText = response.attachment ? JSON.parse(JSON.stringify(response.attachment.payload.text)) : "";
  recipients.forEach(function(recipient, index) {
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
      console.log("callSendAPI - response: " + JSON.stringify(response));
      console.log('index: ' + index);
      var res;
      var isNeedChangeText = index === 0 && response.attachment && recipients.length > 1;
      if(isNeedChangeText) {
        res = JSON.parse(JSON.stringify(response));
        res.attachment.payload.text = 'Please:';
      }
      request_body = {
      //from: "100022693691284",
        "recipient": {
          "id": recipient.id,
        },
        //"sender_action":"typing_off",
        "message": isNeedChangeText ? res : response
      }
  }
  console.log("request_body: " + JSON.stringify(request_body));
    
  displayTheTypingBubble(recipient.id, thread_key, true);
    
  setTimeout(function(){
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          //console.log('message sent!')
        } else {
          //console.error("Unable to send message:" + err);
        }
      }); 
    }, 2000);
  });
}

function displayMessengerProfile() {
 // Construct the message body
  let messenger_profile_request_body = {
    //"data": [
      //{
        //"get_started": "hi",    
        "greeting": [
          {
            "locale":"default",
            "text":"Hello {{user_full_name}}! I am ExuinoxBot, How can I help you?",
            //"image_url":"https://rnd-10-134-86-27.holonlab.avaya.com/portal/custom-styles/999/custom_logo.svg86-27.holonlab.avaya.com/portal/custom-               styles/999/custom_logo.svg",
            //"get_started": "hi"
          }
        ]
    
      //}
    //]
  }
  
  // Send the HTTP request to the messenger profile Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": messenger_profile_request_body
  }, (err, res, body) => {

  }); 
}

function displayTheTypingBubble(senderId, thread_key,isOn) {
  //return new Promise((resolve, reject) => {
  let sender_action = isOn ? "typing_on" : "typing_off";
  let request_body;
  //console.log("request_body: " + JSON.stringify(request_body));
  
  if (thread_key && thread_key !== undefined && thread_key !== null) {
    request_body = {
      "recipient": {
        "thread_key": thread_key
      },
      "sender_action": sender_action
    }
  } else {
    request_body = {
      "recipient": {
        "id": senderId
      },
      "sender_action": sender_action
    }
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
//});
}

function displayMessageMarkSeen(sender, thread_key) {
  console.log('displayMessageMarkSeen');
  
  let request_body = {
      "recipient": {
        "id": sender[0].id
      },
      "sender_action": "mark_seen"
      //"message_id": "m_mid.$cAAX523XTe1hn6TKSZFht-1IN1G90"
    }
    console.log('sender - ' + JSON.stringify(request_body));
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

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
console.log('req.body - ' + JSON.stringify(req.body));
  res.status(200).send('EVENT_RECEIVED');
  // Parse the request body from the POST
  let body = req.body;
  let sender_psid = new Array();
  
  console.log("body.object: " + body.object);
  
  // Check the webhook event is from a Page subscription
  if (body.object === 'page' || body.object === 'group') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      if (body.object === 'page' || body.object === 'group') {
        pageId = entry.id;
      }
      
      if (entry && entry.changes && entry.changes.length > 0) {
        entry.changes.forEach(function(change) {
          console.log("change: " + JSON.stringify(change));
          let value = change.value;

          //console.log("message Itz2 - " + JSON.stringify(sender_psid));
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
              console.log("message Itz - " + JSON.stringify(sender_psid));
              handleMessage(sender_psid, message.trim());
            }
          }
        });
      }
      
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
        //displayMessageMarkSeen(sender_psid, thread_key);
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
    //res.status(200).send('EVENT_RECEIVED');

  } else if (body.object === 'user') {
    body.entry.forEach(function(entry) {
      if (entry && entry.changes && entry.changes.length > 0) {
        entry.changes.forEach(function(change) {
          console.log("change.value.to.data.length - " + change.value.to.data.length);
          if (change.field && change.field === 'message_sends' && 
              change.value.to.data[0].email.indexOf('@facebook.com') === -1 && 
              change.value.to.data.length < 2) {
            console.log("change 1: " + JSON.stringify(change));
            if (change.value.message === '@join') {
              //if(value.to.data[0].email.indexOf('@facebook.com') === -1) {
                 sender_psid.push({"id": change.value.to.data[0].id});
              //}
              sender_psid.push({"id": change.value.from.id});
              //sender_psid.push({"id": change.value.from.community.id});
              //sender_psid.push({"id": value.id});

              handleMessage(sender_psid, change.value.message.trim());
            }
          }
        });
       }
    });
  } else {
    res.status(200).send('EVENT_RECEIVED');
    // Return a '404 Not Found' if event is not from a page subscription
    console.log("sendStatus - 200");
    //res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  //console.log('get');
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
  var verifyTokenList = VERIFY_TOKEN.split(';');
  
  console.log(verifyTokenList); 
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct 
    //if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    if (mode === 'subscribe' && verifyTokenList.indexOf(token) !== -1) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.log('Responds with "403 Forbidden" if verify tokens do not match');
      res.sendStatus(403);      
    }
  }
});

// function get_sender_profile(id) {
//   request({
//     "uri": "https://graph.facebook.com/v2.6/#{'+id+'}",
//     "qs": { "access_token": PAGE_ACCESS_TOKEN },
//     "method": "GET",
//     "fields": 'first_name,last_name,gender,profile_pic'
//   }, (err, res, body) => {
//     if (!err) {
//       console.log(res)
//     } else {
//       //console.error("Unable to send message:" + err);
//     }
//   }); 
// }