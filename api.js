const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json())

const DB = './data.json'
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({groups:[],rekap:{}}))

// ================= SIMPAN LIST GRUP =================
app.post('/groups_save', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  db.groups = req.body.groups || []
  fs.writeFileSync(DB, JSON.stringify(db))
  res.json({status:"OK",total:db.groups.length})
})

// ================= LIST GRUP =================
app.get('/groups_list', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  res.json({groups:db.groups})
})

// ================= UPDATE REKAP =================
app.get('/rekap_update', (req,res)=>{
  const {group_id,user_number,total} = req.query
  const db = JSON.parse(fs.readFileSync(DB))

  if(!db.rekap[group_id]) db.rekap[group_id]={}
  db.rekap[group_id][user_number]={total}

  fs.writeFileSync(DB, JSON.stringify(db))
  res.json({status:"OK"})
})

// ================= AMBIL REKAP =================
app.get('/rekap_get', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB))
  res.json(db.rekap)
})

app.listen(process.env.PORT || 3000, ()=>console.log("API SERVER READY"))

