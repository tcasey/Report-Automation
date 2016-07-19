var Horseman = require('node-horseman'),
  pdfconcat = require('pdfconcat'),
  request = require('request'),
  util = require('util'),
  fs = require('fs'),
  baseURL = 'https://stag-cmo-la.convirza.com/#/',
  filter = '&filter=America',
  keys = require('./keys'),
  date = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  emailData = [],
  obiOne,
  routes = ['home'],
  ou = 'yoda';

//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true
});

////////////////////////
/// Helper Functions ///
////////////////////////

//  Joins multiple single paged PDF's into a single multi-paged PDF. (Say that five times fast)
function pdfUnite() {
  return horseman.do(function(done) {
    pdfconcat(['acquisition/' + emailData[0] +'-'+ routes[1] +'-'+ date[0] + '.pdf', 'acquisition/' + emailData[0] +'-'+ routes[0] +'-'+ date[6] + '.pdf'], 'acquisition/Jedi.pdf', function(err) {
      err ? console.log(err) : console.log('A new Jedi has been born');
    });
    setTimeout(done, 100);
  })
}

function Jedi() {
  return horseman.do(function(done) {
    var obiOne = JSON.stringify(emailData[1]);
    // console.log(obiOne);
    setTimeout(done, 100);
  })
}

function urlParse() {
  return horseman.evaluate(function(ms, done) {
    var url = document.URL;
    done(null, url);
  }, 500)

  .then(function(data) {
    var urlCurrent = data;

    function cleanUrl(urlCurrent) {
      return urlCurrent.split('?')[0];
    }
    var route = urlCurrent.substr(urlCurrent.indexOf("#") + 2);
    console.log(cleanUrl(route));
    routes.unshift(cleanUrl(route));
  })
}

horseman
  .userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36"')

//  adds a cookie
.cookies({
    name: ou,
    value: ou,
    domain: '.convirza.com'
  })
  ////////////////////////
  /////// Home ///////////
  ////////////////////////
  .viewport(780, 980)
  //  opens & logs into cfa app
  .open(baseURL + 'login/')
  .type('input[id="email"]', keys.cfa_email)
  .type('input[id="password"]', keys.cfa_pass)
  .click('[id="b1"]')
  .keyboardEvent('keypress', 16777221)

.log('2 second delay')
  .wait(2000)

.url()
  .log()

.click('[id="leftmenu-trigger"]')

.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
  $('img').hide();
  var filter = $('#filter').text();
  done(null, filter);
}, 500)

.then(function(data) {
  emailData.push(data);
})

.wait(500)
  .then(function() {
    return horseman.pdf('acquisition/' + emailData[0]  +'-'+ routes[0] +'-'+ date[0] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })

.log('1 PDF')

.then(function() {
    return horseman.screenshot('acquisition/' + emailData[0] +'-'+ routes[0] +'-'+ date[1] + '.png')
  })
  .log('2 PNG')

.then(function() {
    return horseman.crop('.col-md-9', 'acquisition/' + emailData[0] +'-'+ routes[0] +'-'+ date[2] + '-cropped.png')
  })
  .log('3 PNG')

/////////////////////////
/// Reports Call Flow ///
/////////////////////////

.evaluate(function(ms, done) {
  $('.fa-bar-chart-o').click();
  $("span:contains('Acquisition')").click();
  $("span:contains('Call Flows')").click();

  done(null);
}, 1000)

.log('waiting.....')
.wait(4000)

.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
  $("button:contains('Reset Charts')").hide();
  // $('#leftmenu-trigger').click();

  done(null);
}, 1000)

.then(urlParse)

.viewport(1080, 980)

.then(function() {
    return horseman.pdf('acquisition/' + emailData[0]  +'-'+ routes[0] +'-'+ date[6] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })
  .log('7 PDF')

//   screenshot of view with appended
.wait(1000)
  .then(function() {
    return horseman.screenshot('acquisition/' + emailData[0] +'-'+ routes[0] +'-'+ date[7] + '.png')
  })
  .log('8 PNG')

//   captures cropped image of page view.
.wait(1000)
  .then(function() {
    return horseman.crop('#callflowreport', 'acquisition/' + emailData[0] +'-'+ routes[0] +'-'+ date[8] + '-cropped.png')
  })
  .log('9 PNG')

.then(pdfUnite)

.log(emailData)
  .log(routes)

.close();
