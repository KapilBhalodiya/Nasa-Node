const path = require('path');
const cors = require('cors');
const express = require('express');
const planetRouter = require('./route/planets/planet.router');
const lunchRouter = require('./route/lunches/lunches.router');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json());
app.use(express.static(path.join(__dirname, '..','public')));
app.use(planetRouter);
app.use(lunchRouter);
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})
module.exports = app;