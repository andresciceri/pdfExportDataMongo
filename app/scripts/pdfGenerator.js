var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
require('mongoose-querystream-worker');
  
var Record = require('../models/record.js');
fs  = require('fs');
PDFDocument = require('pdfkit');

