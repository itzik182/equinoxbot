// server.js
// where your node app starts

// init project
var Bot = require('messenger-bot')
var http = require('http')

const bot = new Bot({
  token: process.env.PAGE_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
})

const users = {}

bot.on('postback', (payload) => {
  if (payload.postback.payload === 'GET_STARTED_PAYLOAD') {
    const senderId = payload.sender.id
    
    bot.getProfile(senderId, (error, profile) => {
      if (error) {
        console.log(error)
      }
      
      users[senderId] = {
        pageScopedId : senderId,
        firstName : profile.first_name, 
        lastName : profile.last_name,
      }
      
      bot.sendMessage(senderId, {text : `Thanks ${profile.first_name}, you've been added to our userbase!`})
      console.log(`${profile.first_name} ${profile.last_name} added to users.`)
      
    })
  }
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')