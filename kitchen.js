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



  // After the login accepts a cookie as auth we can use this feature to navigate the site using tabs like you would in a browser
//  Took out of report script before the close()

  // .openTab('baseURL + filter')

  // .log('waiting for 2 seconds')
  //   .wait(2000)

  // .screenshot('horseman/' + emailData[0] + date[2] + '.png')
  //   .log('Screenshot has been TAKEN')

  //  Proof that the cookies work. Haza!

  // .cookies()
  //   .then(function(cookies) {
  //     console.log(cookies);
  //     return horseman;
  //   })
