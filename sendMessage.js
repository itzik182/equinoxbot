          bot.sendMessage(senderId, 
            { 
              attachment : {
                type : 'template',
                payload : {
                  template_type : 'generic',
                  elements : [
                    {
                      title : article.title,
                      // image_url : article.urlToImage,
                      // subtitle : article.description,
                      // default_action : {
                      //   type : 'web_url',
                      //   url : article.url,
                      //   messenger_extensions : true,
                      //   webview_height_ratio : 'tall',
                      //   fallback_url : 'https://news.ycombinator.com/'
                      // }
                    }
                  ]
                }
              }
            }
         )

 bot.sendMessage(senderId, 
            { 
              attachment : {
                type : 'template',
                payload : {
                  template_type : 'generic',
                  elements : [
                    {
                      title : 'Hello'
                    }
                  ]
                }
              }
            }
         ) 
            
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"1394641700606817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome to Peter\'s Hats",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
              "messenger_extensions": true,
              "webview_height_ratio": "tall",
              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersfancybrownhats.com",
                "title":"View Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token=PAGE_ACCESS_TOKEN"