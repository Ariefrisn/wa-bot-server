const express = require('express')
const fs = require('fs')
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')

const app = express()
app.use(express.json())

const DB = './data.json'
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({groups:[],rekap:{}}))

// ===== API ROUTES =====
app.post('/groups_save', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  db.groups = req.body.groups || []
  fs.writeFileSync(DB, JSON.stringify(db))
  res.json({status:"OK"})
})

app.get('/groups_list',(req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  res.json({groups:db.groups})
})

app.get('/rekap_update',(req,res)=>{
  const {group_id,user_number,total} = req.query
  const db = JSON.parse(fs.readFileSync(DB))
  if(!db.rekap[group_id]) db.rekap[group_id]={}
  db.rekap[group_id][user_number]={total}
  fs.writeFileSync(DB, JSON.stringify(db))
  res.json({status:"OK"})
})

app.get('/rekap_get',(req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  res.json(db.rekap)
})

app.listen(process.env.PORT || 3000, ()=>console.log("API SERVER READY"))

// ===== BOT WA =====
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './auth' }),
  puppeteer: { headless: true, args:['--no-sandbox'] }
})

client.on('qr', qr => {
  console.log('SCAN QR:')
  qrcode.generate(qr,{small:true})
})

client.on('ready', async ()=>{
  console.log("BOT CONNECTED")
  const chats = await client.getChats()
  const groups = chats.filter(c=>c.isGroup).map(g=>({id:g.id._serialized,name:g.name}))
  await axios.post('https://wa-bot-server-production-6ead.up.railway.app/groups_save',{groups})
  console.log("GRUP SYNC:",groups.length)
})

client.initialize()
