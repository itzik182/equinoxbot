// server.js
// where your node app starts

// init project
var Bot = require('messenger-bot')
var http = require('http')
var request = require('superagent')
var _ = require('lodash')

const bot = new Bot({
  token: process.env.PAGE_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
})

const users = {}
bot.on('postback', (payload) => {
  if (payload.postback.payload === 'GET_STARTED_PAYLOAD') {
    const senderId = payload.sender.id
    
    console.log(senderId)
 
    bot.getProfile(senderId, (error, profile) => {
      if (error) {
        console.log(error)
      }
 
      users[senderId] = {
        pageScopedId : senderId,
        firstName : profile.first_name, 
        lastName : profile.last_name,
      }
 
      bot.sendMessage(
        senderId, 
        {text : `Thanks ${profile.first_name},  you're now registered!`}
      )
      console.log(`${profile.first_name} ${profile.last_name} => users`)
   })
  }
})

bot.on('message', (payload, reply) => {
  const message = payload.message.text
  const senderId = payload.sender.id
  
  if (message === 'news') {
    request
      .get('https://newsapi.org/v1/articles?source=hacker-news&sortBy=top&apiKey=52a36d98da214f98a9b9b9bfaba502a7')
      .end((error, result) => {
        const articles = result.body.articles
        
        const elements = _.map(articles, (article) => {
          return {
            "title" : article.title,
            "image_url" : article.urlToImage,
            "subtitle" : _.truncate(
              article.description, 
              {length : 75, separator : '...'}
            ),
            "default_action" : {
              "type" : "web_url",
              "url" : article.url
            },
            "buttons" :[
              {
                "title" : "Read More",
                "type" : "web_url",
                "url" : article.url
              }
            ]
          }
        }).slice(0,4)
        
      
        bot.sendMessage(senderId,
          {
            "attachment" : {
              "type" : "template",
              "payload" : {
                "template_type" : "list",
                "elements" : elements,
                "buttons" :[
                  {
                    "title" : "Read More",
                    "type" : "web_url",
                    "url" : "https://news.ycombinator.com/"
                  }
                ]
                
              }
            }
          }
        )
      
        
       })
   }
})
 
http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')
