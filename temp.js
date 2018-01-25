//let promises = [];
//-------------------
// promises.push(
//   recipients.push(doSomethingAsync(inviteEmails[i], recipients))
// )
//------------------
// Promise.all(promises)
//    .then((results) => {
//        //console.log("All done", results);
// console.log("All done", recipients); 
//   resolve(recipients);
//    })
//  .catch((e) => {
//      // Handle errors here
//  });
//---------------------------------------------------------------------------------------------


// var graphapi2 = request.defaults({
//     baseUrl: 'https://www.facebook.com',
//     json: true,
//     auth: {
//         'bearer' : PAGE_ACCESS_TOKEN 
//     }
// });
//---------------------------------------------------------------------------------------------



// FB.api('/', 'POST', {
//          include_headers: false,
//          batch: [
//               { method: 'GET', relative_url: 'itzik182@gmail.com?fields=id,email,name,primary_phone,department'},
//               { method: "GET", relative_url: "eyall@avaya.com?fields=id,email,name,primary_phone,department" }
//          ]
//        }, function (response) {
//             var obj = JSON.parse(response[1].body);
//             console.log("itzik123455===" + obj.email);
//             console.log("itzik123455===" + JSON.stringify(obj)); 
//             console.log("itzik123455===" + response[1].body); 
//        });
//---------------------------------------------------------------------------------------------

//Post into a group: itzik gmail 100022693691284, itzik avaya - 100022742164286
//graphapi({
//    method: 'POST',
//    url: '/395404170913985/feed?message=This+**@[100022742164286]**+@[100022693691284]+is+a+**formatted**+*post*&formatting=MARKDOWN',
//},function(error,response,body) {
//    if(error) { 
//        console.error(error);
//    } else {
//        console.log('Published post: ' + body.id);
//    }
//});
//---------------------------------------------------------------------------------------------

//graphapi({
//    method: 'POST',
//    url: '/395404170913985/feed',
//    qs: {
//        'message': 'Itzik111',
//        'link': 'https:www.walla.co.il'
//    }
//},function(error,response,body) {
//    if(error) {
//        console.error(error);
//    } else {
//        var post_id = JSON.stringify(body).id;
//        console.log('Published itzik111: ' + post_id);
//    }
//});
//---------------------------------------------------------------------------------------------


//  function doSomethingAsync(inviteEmail) {
//   return new Promise((resolve, reject) => {
//     graphapi({
//       method: 'POST',
//       url: '/',
//       batch: [
//           { method: 'GET', relative_url: 'itzik182@gmail.com?fields=id,email,name,primary_phone,department'},
//           { method: "GET",relative_url: "eyall@avaya.com?fields=id,email,name,primary_phone,department" }
//      ]
//       //url: '/itzik182@gmail.com,eyall@avaya.com?fields=id,email,name,primary_phone,department',
//       //url: '/' + inviteEmail + '?fields=id,email,name,primary_phone,department',
//     },function(error,response,body) {
//       console.log("body.id1117-" + JSON.stringify(response));
//         console.log("body.id1117-" + JSON.stringify(body));
//       if(error) {
//         console.error(error);
//         reject(error);
//       } else { 
//         console.log("body.id1117-" + JSON.stringify(response));
//         console.log("body.id1117-" + JSON.stringify(body));
//         if (body && body.id) { 
//           console.log("body.id1116-" + body.id);
//           //recipients.push({"id": body.id });
//           //if (i === inviteEmails.length) {
//             console.log("resolve");
//             resolve({"id": body.id });
//           //}
//         }
//       }
//     })
//   });
// }
//---------------------------------------------------------------------------------------------

////events:

// var eventData = {
//         "id" : 374369296368380,
//         "start_time" : Math.round(new Date().getTime()/1000.0), //'2011-04-01T14:00:00+0000',
//         "end_time": Math.round(new Date().getTime()/1000.0)+100, //'2011-05-01T14:00:00+0000',
//         "location" : 'location',
//         "name" : 'This is a new event',
//         "description":'This is a new event222',
//         "privacy":"OPEN"
//     }

// var eventData2 = {"description":"Test Event Description","name":"Test Event","place":{"name":"Tel Aviv, Israel","location":{"city":"Tel Aviv","country":"Israel","latitude":32.0667,"longitude":34.7667},"id":"106371992735156"},"start_time":"2018-01-21T15:00:00+0200","id":"142175346457096"}
// var eventData3 = {"id" : 583221065350500, "can_guests_invite": true}

// FB.api('https://graph.facebook.com/v2.6/me/events', 'POST', eventData2, function (response) { //395404170913985
//     //console.log("events response - " + JSON.stringify(response));
//  });

// FB.api('https://graph.facebook.com/v2.6/395404170913985/events','post',{name:"JS-SDK Event",start_time:1272718027,location:"Beirut"},function(resp) {
//   //console.log("events response2 - " + JSON.stringify(resp));
// });

// FB.api('https://graph.facebook.com/v2.4/374369296368380/invited?users=100022693691284',eventData , 'post', function (response) { //395404170913985
//       //console.log("events response3 - " + JSON.stringify(response));
//  });


////--------
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

// request.post({ 
//   url : "https://graph.facebook.com/853549721475416/activities",
//   form: {
//     event: 'CUSTOM_APP_EVENTS',
//     custom_events: JSON.stringify([{
//       _eventName: "fb_mobile_purchase1123",
//       _valueToSum: 55.22,
//       _fb_currency: 'USD'
//     }]),
//     advertiser_tracking_enabled: 0,
//     application_tracking_enabled: 0,
//     //extinfo: JSON.stringify(['mb1']),
//     page_id: '395404170913985',
//     page_scoped_user_id: '100022693691284'
//   }
// }, function(err,httpResponse,body){ 
//   console.log(err);
//   console.log(httpResponse.statusCode);
//   console.log(body);
// });
// //-------

//---------------------------------------------------------------------------------------------

////getTextMessageResponse:

// case 'buttons':
//         text = 'https://avayaequinoxmeetings.com/scopia/mt/9022?ID=' + VR;
//         buttons:[
//           {
//             "type":"web_url",
//             "url":"https://avayaequinoxmeetings.com/scopia/mt/9022?ID=" + VR,
//             "title":"Link to guy vr",
//             "webview_height_ratio": "full",
//             "messenger_extensions": true,  
//             "fallback_url": "https://petersfancyapparel.com/fallback"
//           }
//         ]
//         break;


// case '_letsa meet':
    //     text = 'Which virtual room?';
    //     quick_replies = [
    //         {
    //           //"type": "postback",
    //           "content_type":"text",
    //           "title":"Itzik",
    //           //"image_url":"http://example.com/img/red.png",
    //           "payload":"yes"
    //         },
    //           {
    //           "content_type":"text",
    //           "title":"Ronny",
    //           //"image_url":"http://example.com/img/red.png",
    //           "payload":"<lets meet ronny room>"
    //         },
    //           {
    //           "content_type":"text",
    //           "title":"Anna",
    //           //"image_url":"http://example.com/img/red.png",
    //           "payload":"<lets meet anna room>"
    //         }
    //     ]
    //     break;
      
    // case 'location':
    //     text = "location";
    //     quick_replies = [
    //       {
    //         "content_type":"location"
    //       }
    //     ];
    //     break;
    //default:
    //    text = `You sent the message: "${received_message.text}".`;
    //}

    // if(received_message.includes("meet") || received_message.includes("discuss") || received_message.includes("brainstorm") || received_message.includes("meeting")){
    //   text = 'May I suggest you enter your virtual room: https://alphaconfportal.avaya.com:8443/portal/tenants/default/?ID=' + VR;
    // }

    //if (received_message.text === 'lets meet') {    
    //  text = 'https://rnd-10-134-86-27.holonlab.avaya.com:8443/portal/tenants/default/?ID=661236';
    //}
    //else {
    //  text = 'You sent the message: "${received_message.text}". Now send me an image111!';
    //}
    //console.log("text556 - " + text);
    // Create the payload for a basic text message 
    
    //---------------------------------------------------------------------------------------------