const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')

const API = "https://YOUR-RAILWAY-URL"

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './auth' }),
  puppeteer: { headless: true, args:['--no-sandbox'] }
})

client.on('qr', qr => qrcode.generate(qr,{small:true}))

client.on('ready', async ()=>{
  console.log("BOT CONNECTED")

  const chats = await client.getChats()
  const groups = chats.filter(c=>c.isGroup).map(g=>({
    id:g.id._serialized,
    name:g.name
  }))

  await axios.post(API+'/groups_save',{groups})
  console.log("GRUP SYNC:",groups.length)
})

client.initialize()

