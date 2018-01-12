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

 function doSomethingAsync(inviteEmail) {
      return new Promise((resolve, reject) => {
        graphapi({
          method: 'POST',
          url: '/',
          batch: [
              { method: 'GET', relative_url: 'itzik182@gmail.com?fields=id,email,name,primary_phone,department'},
              { method: "GET",relative_url: "eyall@avaya.com?fields=id,email,name,primary_phone,department" }
         ]
          //url: '/itzik182@gmail.com,eyall@avaya.com?fields=id,email,name,primary_phone,department',
          //url: '/' + inviteEmail + '?fields=id,email,name,primary_phone,department',
        },function(error,response,body) {
          console.log("body.id1117-" + JSON.stringify(response));
            console.log("body.id1117-" + JSON.stringify(body));
          if(error) {
            console.error(error);
            reject(error);
          } else { 
            console.log("body.id1117-" + JSON.stringify(response));
            console.log("body.id1117-" + JSON.stringify(body));
            if (body && body.id) { 
              console.log("body.id1116-" + body.id);
              //recipients.push({"id": body.id });
              //if (i === inviteEmails.length) {
                console.log("resolve");
                resolve({"id": body.id });
              //}
            }
          }
        })
      });
    }