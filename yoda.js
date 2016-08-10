var Horseman = require('node-horseman'),
  config = require('./config.json'),
  pdfconcat = require('pdfconcat'),
  keys = require('./keys'),
  co = require('co'),
  emailData = [],
  routes = [],
  namely = [],
  concatIt = [],
  pageAmt = [];



//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true,
  timeout: 30000
});

horseman
  .open('http://en.wikipedia.org/wiki/Headless_Horseman')
  .evaluate( function(selector){
      // This code is executed inside the browser.
      // It's sandboxed from Node, and has no access to anything
      // in Node scope, unless you pass it in, like we did with 'selector'.
      //
      // You do have access to jQuery, via $, automatically.
      return {
        height : $( selector ).height(),
        width : $( selector ).width()
      }
    }, '.thumbimage')
  .then(function(size){
    console.log(size);
    return horseman.close();
  });
