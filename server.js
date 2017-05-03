// server.js
// where your node app starts

// init project
var Bot = require('messenger-bot')
var http = require('http')

const users = {}

const bot = new Bot({
  token: process.env.PAGE_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
})

bot.on('postback', (payload) => {
  if (payload.postback.payload === 'GET_STARTED_PAYLOAD') {
    const senderId = payload.sender.id
    
    bot.getProfile(senderId, (error, profile) => {
      if (error) {
        console.log(error)
      }
      
      console.log(profile)
      
      users[senderId] = {
        pageScopedId : senderId,
        firstName : profile.first_name, 
        lastName : profile.last_name,
      }
      
      console.log(users)
    })
  }
})



http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')