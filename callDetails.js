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
  pageAmt = [],
  newImage = [],
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
    pdfconcat(['callDetails/' + emailData[0] +'-'+ routes[1] +'-'+ date[0] + '.pdf', 'callDetails/' + emailData[0]  +'-'+ routes[0] +'-'+ date[3] + '.pdf'], 'callDetails/Jedi.pdf', function(err) {
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
    routes.unshift(cleanUrl(route));
  })
}

function paginationLogic() {
  return horseman.evaluate(function(ms, done) {
    var paginationIndicator = $('.mb10').text();
    done(null, paginationIndicator);
  }, 500)

  .then(function(data) {
    var text = data.split(' ').reverse();
    var page = (Math.ceil(text[0]/100))
    pageAmt.unshift(page);

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
    return horseman.pdf('callDetails/' + emailData[0]  +'-'+ routes[0] +'-'+ date[0] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })

.log('1 PDF')

.then(function() {
    return horseman.screenshot('callDetails/' + emailData[0] +'-'+ routes[0] +'-'+ date[1] + '.png')
  })
  .log('2 PNG')

.then(function() {
    return horseman.crop('.col-md-9', 'callDetails/' + emailData[0] +'-'+ routes[0] +'-'+ date[2] + '-cropped.png')
  })
  .log('3 PNG')

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
  .wait(2000)

.then(urlParse)
.then(paginationLogic)
.log(pageAmt)

.viewport(1200, 980)

.click('[id="leftmenu-trigger"]')

.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
  // $('.fa-calendar').click();
  // $("li:contains('Last 30 Days')").click();
  // setTimeout(10000);
  // $('.dropdown-toggle').click();
  // $("a:contains('CSV')").click();
  $('img').hide();
  $('#simpleChart').hide();
  $('.fa-chevron-down').hide();
  $('.input-group-btn').hide();
  $("button:contains('Advanced filter')").hide();
  $('#leftmenu-trigger').click();

  var filter = $('#filter').text();
  done(null, filter);
}, 500)

//  this block is getting the clean ou bread crumb appended from above and then hiding it.
//  only exists because current ou bred crumb has some weird stuff attatched to it.
.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=cleanBC>BreadCrumb</span>');
  var bc = $('#cleanBC').text();
  $('#cleanBC').hide();

  done(null, bc);
}, 500)

.then(function(data) {
    emailData.push(data);
  })
  .then(Jedi)

.then(function() {
    return horseman.pdf('callDetails/' + emailData[0]  +'-'+ routes[0] +'-'+ date[3] + '.pdf', {
      format: 'A2',
      orientation: 'portrait',
      margin: '0.2in'
    })
  })
  .log('4 PDF')

.then(function() {
    return horseman.screenshot('callDetails/' + emailData[0] +'-'+ routes[0] +'-'+  date[4] + '.png')
  })
  .log('5 PNG')

.then(function() {
    return horseman.crop('.panel-inverse', 'callDetails/' + emailData[0] +'-'+ routes[0] +'-'+ date[5] + '-cropped.png')
  })
  .log('6 PNG')

  // .screenshotBase64('PNG')
  // .then(function() {
  //   var newImage = horseman.cropBase64('.panel-inverse', 'PNG');
  //   return newImage.unshift(newImage);
  // })

  .then(pdfUnite)

  .log(emailData)
    .log(routes)

    //  Proof that the cookies work. Haza!

    .cookies()
      .then(function(cookies) {
        console.log(cookies);
        return horseman;
      })

.close();
