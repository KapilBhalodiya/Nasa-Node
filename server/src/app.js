const express = require('express');
const planetRouter = require('./route/planets/planet.router');
const lunchRouter = require('./route/lunches/lunches.router');
const app = express();

app.use(express.json());
app.use(planetRouter);
app.use(lunchRouter);

module.exports = app;