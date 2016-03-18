var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  async = require('async');
  //Article = mongoose.model('Article');
var Record = require('../models/record.js');
var request = require('request');
fs  = require('fs');
PDFDocument = require('pdfkit');
var mkdir = require('mkdirp');



module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  res.render('index', {
      title: 'PDF Generator Mamut'
    });
});

router.post('/', function (req, res, next){
  var consl = req.body.data;
  var response={};
  var data;
  consl = consl.replace(/\\"/g, '"');
  consl = consl.split("-");

  if(consl.length!=0){
    if(consl.length>=2){
      mkdir('files/' + consl[0]);

      Record.paginate({'associatedParty.firstName':{ "$regex": consl[0], "$options": "i" },'associatedParty.lastName':{ "$regex": consl[1], "$options": "i" }}, { select : 'taxonRecordName associatedParty creation_date', sort : { _id: -1 }, page: 1, limit: 200 }, function(err, records) {
        if(err){
            response = {"error" : true,"message" : "Error fetching data"};
          }else{
            async.forEachOf(records.docs, function(value, key, callback){
            if(typeof  value._doc.creation_date==="undefined"){
              creation_date=value._id.getTimestamp();
              value._doc.creation_date =creation_date.toString();
            }

            Record.findById(value._id, function(err, record){
              if(err)
                res.send(err);

              var doc = new PDFDocument;
              doc.pipe(fs.createWriteStream('files/' + consl[0] + '/' + 'fichas_' + consl[0]+ '_' +record._id + '.pdf'));
              doc.fontSize(12);
              doc.text('Reporte de Fichas para el usuario: '+consl[0]+' '+consl[1], 20, 20);
              doc.moveDown();
              doc.text('Ficha ID: ' + record._id,20);
              doc.text('Fecha de creación: '+ record._doc.creation_date,20);
              doc.moveDown(1)
              var aux = record._doc;
              pdfWriter(doc, aux, 10);

              doc.end();
              callback();
              
            });


          }, function(err){
              console.log('Proccess finished');
               return next();
            });
        } 
      });

/*
      Record.find({'associatedParty.firstName':{ "$regex": consl[0], "$options": "i" },'associatedParty.lastName':{ "$regex": consl[1], "$options": "i" }}, 'taxonRecordName associatedParty creation_date', {sort : { _id: -1 },limit : 200}, function(err, records){
          if(err)
            res.send(err);
          
      });*/
    }
  }else{
    data = 'No results';
    console.log(data);
    //res.json({ message: 'No results'});
  }
    



});  

var pdfWriter = function (doc, data, ini, index){
    
  _ini = 20;
  
  console.log(_ini);
  
  if (!(data instanceof Array) && !(data instanceof Object)){
    console.log(data);
    doc.fillColor('black');
    doc.fontSize(10);
    doc.text(index + ': ' + data, _ini);
    _ini = 20;

  }else {
    
    var keys = Object.keys(data);

    if (keys instanceof Array){
      keys.forEach(function(key){

        if (data[key] instanceof Array){
          data_arr = data[key];
          doc.fontSize(12)
          .moveDown(0.5)
          .fillColor('blue')
          .text(key,_ini)
          .fillColor('black')
          .moveDown(0.5);

          for (var i = 0; i < data_arr.length; i++) {
            pdfWriter(doc, data_arr[i], _ini, key);
             
          }

        } else if (data[key] instanceof Object){
            var data_obj = data[key];
            var oKeys = Object.keys(data[key]);
            doc.fontSize(11)
            .moveDown(0.5)
            .text(key,_ini)
            .moveDown(0.5);

            if (oKeys instanceof Array) {

                for (var i = 0; i < oKeys.length; i++) {
                  pdfWriter(doc, data_obj[oKeys[i]], _ini, oKeys[i]);
                };
            };
                        
        } else {
            doc.fillColor('black');
            doc.fontSize(10);
            doc.text(key + ': ' + data[key], _ini);  
        }
                      
      });
    }
  }
}
    
  

