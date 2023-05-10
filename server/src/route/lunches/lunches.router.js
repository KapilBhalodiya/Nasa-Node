const express = require('express');
const {
    httpgetAllLunches,
    httpAddNewLunche,
    httpAbortLunche
} = require('./lunches.controller');

const lunchRouter = express.Router();

lunchRouter.get('/lunches',httpgetAllLunches);
lunchRouter.post('/lunches',httpAddNewLunche);
lunchRouter.delete('/lunches/:id',httpAbortLunche);

module.exports = lunchRouter