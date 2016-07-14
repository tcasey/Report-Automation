var utils = require('utils');
var keys = require('./keys');
var casper = require("casper").create({
  clientScripts: ["node_modules/jquery/dist/jquery.min.js"],
  pageSettings: {
    // userName: ,
    // password: ,
    // loadImages: false,
    // loadPlugins: false,
    webSecurityEnabled: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36'
  }
});

//  SNAPSHOT CREATOR OF SPECIFIC ELEMENT ID

// casper.start('http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=1&');
//   casper.viewport(1024,768).then(function() {
//       casper.wait(3000, function() {
//         this.captureSelector('captured/images/d3-selected.png', '.ledeStory');
//         this.echo('Captured.');
//       });
//   });

//  PDF CREATOR WITH PAGE SIZE

// casper.start();
//
// casper.page.paperSize = {
//   width: '11in',
//   height: '8.5in',
//   orientation: 'landscape',
//   border: '0.4in'
// };
//
// casper.thenOpen('http://regionalcrossfitshowdown.com/#/home', function() {
//   casper.viewport(1600, 1000).then(function() {
//      casper.wait(7000, function() {
//         this.capture('captured/pdfs/crossfit.pdf');
//         this.echo('created pdf.');
//       });
// });

//  PDF CREATOR THAT USES JQUERY TO MANIPULATE THE DOM

// casper.start().viewport(1024,768);
//
// casper.thenOpen('http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=1&', function() {
//   var dom = this.evaluate(function() {
//     var force = $('#nytg-nav-mandatory').click();
//     var hideNav = $('.subNavigation').hide();
//     var hideHead = $('#masthead').hide();
//     var hideAd = $('#TopAd').hide();
//     var hideTools = $('#memberTools').hide();
//     var hideTabs = $('.tabsContainer').hide();
//     var hideMain = $('#mainTabs').hide();
//     var hideList = $('#toolsList').hide();
//     var hideFooter = $('#footer').hide();
//
//     return force && hideNav && hideHead && hideAd && hideTools && hideTabs && hideMain && hideFooter && hideList;
//   });
//   this.echo('DOM has been man handeled');
//   casper.wait(3000, function() {
//     this.capture('captured/pdfs/d3-selected.pdf', {
//         top: 0,
//         left: 0,
//         width: 1024,
//         height: 768
//     });
//   });
//     this.echo('created pdf.');
//
// });



// CAPTURE HTML OF A GIVEN ELEMENT WITH MATCHING ID

// casper.start('http://jifagergren.com/', function() {
//     this.echo(this.getHTML('footer#Footer'));
// });

// FAILED ATTEMPT AT HTTP AUTH

// casper.start().viewport(1320,768);
//
//
// casper.thenOpen('https://cfa.convirza.com/#/login', function() {
//   casper.setHttpAuth('USERNAME', 'PASSWORD');
//     this.echo("I'm in. Bazinga.");
//
//
//     var dom = this.evaluate(function() {
//       // var force = $('#nytg-nav-mandatory').click();
//       var hideNav = $('.navbar').hide();
//       var hideSide = $('#page-leftbar').hide();
//
//       return force && hideNav && hideSide;
//     });
//     this.echo('DOM has been man handeled');
//
//       casper.wait(3000, function() {
//         this.capture('captured/pdfs/cfa.pdf', {
//             top: 0,
//             left: 0,
//             width: 1024,
//             height: 768
//         });
//       });
//         this.echo('created pdf.');
//
//     });



// LOGIN TO CFA AND TAKE A SNAPSHOT
// casper.options.onResourceRequested = function(C, requestData, request) {
//   utils.dump(requestData.headers);
// };
// casper.options.onResourceReceived = function(C, response) {
//   utils.dump(response.headers);
// }
// casper.on("page.error", function(msg, trace) {
//      this.echo("Error: " + msg, "ERROR");
// });
var base = "https://cfa.convirza.com/#/acq-call-flows4?report=campaign";
var filter = "&filter=America";
var date = "&start_date=2016-07-05&end_date=2016-07-12";


casper.start().thenOpen("https://cfa.convirza.com/#/login", function() {
  this.echo("convirza website login opened");
});

casper.viewport(1600, 1000).then(function() {
  this.echo("Login using username and password");
  casper.evaluate(function(email, password) {
    document.getElementById("email").value = keys.cfa_email;
    document.getElementById("password").value = keys.cfa_pass;
    document.getElementById("b1").disabled = false;
    document.getElementById("b1").click();
    // document.getElementsByClassName("pull-left").click();
  }, keys.cfa_email, keys.cfa_pass);
  this.echo("Login form has been filled");
});
casper.wait(7000, function() {
  this.capture('captured/images/CFA1.png');
  this.echo('created png.');
});
casper.thenOpen("https://cfa.convirza.com/#/acq-call-flows4?report=campaign&filter=America", function() {
  this.echo("convirza website home page opened");
});
casper.wait(7000, function() {
  this.capture('captured/images/CFA2.png');
  this.echo('created png.');
});

//  this.echo(this.getHTML('div#wrap'));

// SHOULD ENABLE COOKIES. HAVENT TESTED YET

// casper.test.setUp(function () {
//   casper.echo('Cookies enabled?: ' + phantom.cookiesEnabled);
//
//   phantom.addCookie({
//       'name': 'connect.sid',
//       'value': '',
//       'domain': 'precourse.herokuapp.com',
//       'path': '/',
//       'http': true
//   });
//
//   casper.start("http://precourse.herokuapp.com/#/home", function () {
//     casper.echo('Start callback has cookie: ' + JSON.stringify(phantom.cookies));
//   });
// });
// casper.test.begin("Should do usefull stuff", function (test) {
//   // …
// });


casper.run();
