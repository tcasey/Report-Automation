var Horseman = require('node-horseman'),
  pdfconcat = require('pdfconcat'),
  // im = require('imagemagick'),
  // co = require('co'),
  baseURL = 'https://cfa.convirza.com/#/',
  filter = '&filter=America',
  keys = require('./keys'),
  date = [1, 2, 3],
  emailData = [],
  emailDataReturned,
  ou = 'yoda';

//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true
});

//  set viewport and user agent for proper rendering
horseman
  .userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36"')
  .viewport(780, 980)

  //  adds a cookie
.cookies({
  name: ou,
  value: ou,
  domain: '.convirza.com'
})

//  opens & logs into cfa app
.open(baseURL + 'login/')
  .type('input[id="email"]', keys.cfa_email)
  .type('input[id="password"]', keys.cfa_pass)
  .click('[id="b1"]')
  .keyboardEvent('keypress', 16777221)

.log('waiting for 2 seconds')
  .wait(2000)

// Click to close leftmenu-trigger
.click('[id="leftmenu-trigger"]')

//   pdf capture. Tabloid is the best looking format for the home page
  //  only exists so I can append two PDF's into one
.pdf('horseman/' + emailData[0] + date[0] + '.pdf', {
    format: 'Tabloid',
    orientation: 'portrait',
    margin: '0.2in'
  })
  .log('PDF has been CAPTURED')

//  Manipulates the DOM appending some things and hiding some others.
.evaluate(function(ms, done) {
  $('#page-heading').append('<span id=filter>yoda</span>');
  $('.fa-bar-chart-o').click();
  $('.navbar').hide();
  $('.page-leftbar').hide();
  $('img').hide();
  var filter = $('#filter').text();
  done(null, filter);
}, 1000)

.then(function(data) {
    emailData.push(data);
  })
  .log(emailData)

//  this block is getting the clean ou bread crumb appended from above and then hiding it.
  //  only exists because current ou bred crumb has some weird stuff attatched to it.
  .evaluate(function(ms, done) {
    $('#page-heading').append('<span id=cleanBC>ou Bread Crumb</span>');
    var bc = $('#cleanBC').text();
    $('#cleanBC').hide();

    done(null, bc);
  }, 1000)

  .then(function(data) {
      emailData.push(data);
      console.log('Its working! ITS WOOOORRRKKKING!!!', emailData[0]);
    })
    .log(emailData)

    .wait(2000)

//   screenshot of view with appended
.screenshot('horseman/' + emailData[0] + date[1] + '.png')
  .log('Screenshot has been TAKEN')

//   pdf capture. Tabloid is the best looking format for the home page
  //  we might need to have different formating for different reports
.pdf('horseman/' + emailData[0] + date[1] + '.pdf', {
    format: 'Tabloid',
    orientation: 'portrait',
    margin: '0.2in'
  })
  .log('PDF has been CAPTURED')

//   captures cropped image of page view.
.crop('.col-md-9', 'horseman/' + emailData[0] + date[2] + '.png')
  .log('Cropped screenshot has been TAKEN')

// After the login accepts a cookie as auth we can use this feature to navigate the site using tabs like you would in a browser

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

.close();

//  Joins multiple single paged PDF's into a single multi-paged PDF. (Say that five times fast)
setTimeout(function() {
  pdfconcat(['horseman/yoda1.pdf', 'horseman/yoda2.pdf'], 'horseman/Jedi.pdf', function(err) {});
  console.log('A new Jedi has been born');
  console.log(emailData[0]);
}, 10000)
