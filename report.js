var Horseman = require('node-horseman'),
  pdfconcat = require('pdfconcat'),
  request = require('request'),
  util = require('util'),
  fs = require('fs'),
  baseURL = 'https://cfa.convirza.com/#/',
  filter = '&filter=America',
  keys = require('./keys'),
  date = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  emailData = [],
  obiOne,
  ou = 'yoda';

//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true
});

//  Joins multiple single paged PDF's into a single multi-paged PDF. (Say that five times fast)
function pdfUnite() {
  return horseman.do(function(done) {
    pdfconcat(['horseman/' + emailData[0] + date[0] + '.pdf', 'horseman/' + emailData[0] + date[3] + '.pdf', , 'horseman/' + emailData[0] + date[6] + '.pdf'], 'horseman/Jedi.pdf', function(err) {
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
}, 1500)

.then(function(data) {
  emailData.push(data);
})

.wait(1000)
.then(function() {
  return horseman.pdf('horseman/' + emailData[0] + date[0] + '.pdf', {
    format: 'A2',
    orientation: 'portrait',
    margin: '0.2in'
  })
})

.log('yoda1 PDF')

.then(function() {
    return horseman.screenshot('horseman/' + emailData[0] + date[1] + '.png')
  })
  .log('yoda2 PNG')

.then(function() {
    return horseman.crop('.col-md-9', 'horseman/' + emailData[0] + date[2] + 'cropped.png')
  })
  .log('yoda3 PNG')

////////////////////////
//// Call Details //////
////////////////////////

//  Manipulates the DOM and navigates to Call Details page.
.evaluate(function(ms, done) {
  $('.fa-bar-chart-o').click();
  $("span:contains('Call Logs')").click();
  $("span:contains('Details')").click();

  done(null);
}, 1000)

.log('waiting.....')
  .wait(4000)
  .url()
  .log()
  .viewport(1100, 980)

.click('[id="leftmenu-trigger"]')

.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
    // $('.fa-calendar').click();
    // $("li:contains('Last 30 Days')").click();
    // setTimeout(10000);
  $('.dropdown-toggle').click();
  $("a:contains('CSV')").click();
  $('img').hide();
  $('#simpleChart').hide();
  $('.fa-chevron-down').hide();
  $('.input-group-btn').hide();
  $("button:contains('Advanced filter')").hide();
  $('#leftmenu-trigger').click();

  var filter = $('#filter').text();
  done(null, filter);
}, 1000)

//  this block is getting the clean ou bread crumb appended from above and then hiding it.
//  only exists because current ou bred crumb has some weird stuff attatched to it.
.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=cleanBC>BreadCrumb</span>');
  var bc = $('#cleanBC').text();
  $('#cleanBC').hide();
  $('#filter').hide();

  done(null, bc);
}, 1000)

.then(function(data) {
  emailData.push(data);
})
.then(Jedi)

.then(function() {
    return horseman.pdf('horseman/' + emailData[0] + date[3] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })
  .log('yoda4 PDF')

//   screenshot of view with appended
.then(function() {
    return horseman.screenshot('horseman/' + emailData[0] + date[4] + '.png')
  })
  .log('yoda5 PNG')

//   captures cropped image of page view.
.then(function() {
    return horseman.crop('.panel-inverse', 'horseman/' + emailData[0] + date[5] + 'cropped.png')
  })
  .log('yoda6 PNG')

  /////////////////////////
  /// Reports Call Flow ///
  /////////////////////////

.evaluate(function(ms, done) {
  $('.fa-bar-chart-o').click();
  $("span:contains('Acquisition')").click();
  $("span:contains('Call Flows')").click();

  done(null);
}, 1000)

.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
  $("button:contains('Reset Charts')").hide();
  // $('#leftmenu-trigger').click();

  done(null);
}, 1000)

.log('waiting.....')
  .wait(4000)
  .url()
  .log()
  .viewport(1080, 980)


.then(function() {
    return horseman.pdf('horseman/' + emailData[0] + date[6] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })
  .log('yoda7 PDF')

//   screenshot of view with appended
.wait(1000)
.then(function() {
    return horseman.screenshot('horseman/' + emailData[0] + date[7] + '.png')
  })
  .log('yoda8 PNG')

//   captures cropped image of page view.
.wait(1000)
.then(function() {
    return horseman.crop('#callflowreport', 'horseman/' + emailData[0] + date[8] + 'cropped.png')
  })
  .log('yoda9 PNG')

.then(pdfUnite)

.close();
