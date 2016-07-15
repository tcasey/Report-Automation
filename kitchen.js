var Horseman = require("node-horseman");

Horseman.registerAction('size', function(selector) {
  // The function will be called with the Horseman instance as this
  var self = this;
  // Return the horseman chain, or any Promise
  return this
    .waitForSelector(selector)
    .then(function() {
      return {
        w: self.width(selector),
        h: self.height(selector)
      };
    })
    .props();
});

var horseman = new Horseman();
horseman
  .open('http://tcasey.me')
  .size('body')
  .log() // { w: 400, h: 240 }
  .close();
