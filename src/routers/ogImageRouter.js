const express = require('express');
const ogImageController = require('../controllers/ogImage');

const ogImageRouter = express.Router();

ogImageRouter.get('/:symbol', ogImageController.getGraphImageForSymbol);
module.exports = ogImageRouter;
