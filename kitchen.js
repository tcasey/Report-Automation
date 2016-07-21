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
  ou = 'yoda',
  co = require('co');


////////////////////////
/// Helper Functions ///
////////////////////////

//  Joins multiple single paged PDF's into a single multi-paged PDF. (Say that five times fast)
function pdfUnite() {
  return horseman.do(function(done) {
    pdfconcat(['callDetails/' + emailData[0] + '-' + routes[1] + '-' + date[0] + '.pdf', 'callDetails/' + emailData[0] + '-' + routes[0] + '-' + date[3] + '.pdf'], 'callDetails/Jedi.pdf', function(err) {
      err ? console.log(err) : console.log('A new Jedi has been born');
    });
    setTimeout(done, 100);
  })
}

//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true,
  timeout: 15000
});

horseman
  .userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36"')

co(function*() {
  // yield horseman.cookies({
  //   name: ou,
  //   value: ou,
  //   domain: '.convirza.com'
  // })
  yield horseman.viewport(780, 980);
  yield horseman.open(baseURL + 'login/');
  yield horseman.type('input[id="email"]', keys.cfa_email);
  yield horseman.type('input[id="password"]', keys.cfa_pass);
  yield horseman.click('[id="b1"]');
  yield horseman.keyboardEvent('keypress', 16777221);

  yield horseman.log('2 second delay');
  yield horseman.wait(2000);

  yield horseman.click('[id="leftmenu-trigger"]');

  var url = yield horseman.url();
  console.log(url);

  var title = yield horseman.title();
  console.log('Title: ' + title); //Convirza for Advertisers
  emailData.unshift(title);

  yield horseman.pdf('co/' + emailData[0] + '-' + routes[0] + '-' + date[0] + '.pdf', {
    format: 'A2',
    orientation: 'portrait',
    margin: '0.2in'
  })
  console.log('1 PDF');

  yield horseman.screenshot('co/' + emailData[0] + '-' + routes[0] + '-' + date[1] + '.png')
  console.log('2 PNG');

  yield horseman.crop('.col-md-9', 'co/' + emailData[0] + '-' + routes[0] + '-' + date[2] + '-cropped.png')
  console.log('3 PNG');

  ////////////////////////
  //// Call Details //////
  ////////////////////////

  yield horseman.evaluate(function(ms, done) {
    $('.fa-bar-chart-o').click();
    $("span:contains('Call Logs')").click();
    $("span:contains('Details')").click();
    done(null);
  }, 1000)
  console.log('waiting ....');

  yield horseman.waitForSelector('.mb10');
  yield horseman.viewport(1200, 980);

  yield horseman.evaluate(function() {
    $('fa-calendar').click();
    $("li:contains('Last 30 Days')").click();
  })

  yield horseman.wait(4000);

  var urlCurrent = yield horseman.url();
  var cleanUrl = urlCurrent.split('?')[0];
  var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
  routes.unshift(route);

  console.log(route); // calls-details

  var text = yield horseman.text('.mb10');
  var paginationIndicator = text.split(' ').reverse();
  var page = (Math.ceil(paginationIndicator[0] / 100))

  pageAmt.unshift(page);
  var pageLogic = pageAmt[0];
  console.log('# of paginated pages: ', pageLogic); // # of paginated pages: #

  if (pageLogic > 1) {

    for (var i = 1; pageLogic >= i; i++) {
      yield horseman.evaluate(function() {
        var filter = document.URL.split('?')[1];
        if (filter !== undefined) {
          $(document).ready(function() {
            $('#cdr_table').append('<span id=cleanBC>' + filter + '</span>');
          });
        }
      })
      yield horseman.crop('.panel-inverse', 'co/' + emailData[0] + '-' + routes[0] + '-' + i + '.png');

      yield horseman.wait(1000);

      yield horseman.click('button:contains("Next 100")');

      console.log('page ', i);
      // yield horseman.wait(7000);
      yield horseman.waitForSelector('.btn-midnightblue');
    }
  } else {
    yield horseman.evaluate(function() {
      var cleanUrl = document.URL.split('?')[1];
      var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
      $('#page-heading').append('<span id=cleanBC>' + cleanUrl + '</span>');
    })
    yield horseman.screenshot('co/' + emailData[0] + '-' + routes[0] + '-.png')
  }



  // var appendImage = yield horseman.screenshotBase64('JPEG');
  // console.log(appendImage);
  // yield horseman.evaluate(function(ms, done, appendImage) {
  //   var appendImage = appendImage;
  //   $('#page-heading').append('<img src="data:image/jpeg;base64,' + appendImage + ' " ');
  //   done(null);
  // }, 1000)
  // yield horseman.wait(5000);
  // yield horseman.screenshot('co/' + emailData[0] + '-' + routes[0] + '-' + date[6] + '.png')
  // console.log('7 PNG');
  // console.log(emailData);


  yield horseman.close();
}).catch(function(data) {
  console.log(data)
});
