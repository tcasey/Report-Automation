var Horseman = require('node-horseman'),
  im = require('imagemagick'),
  pdfconcat = require('pdfconcat'),
  baseURL = 'https://cfa.convirza.com/#/',
  filter = '&filter=America',
  keys = require('./keys'),
  date = [1, 2, 3],
  ou = 'yoda';

var horseman = new Horseman({
  injectBluebird: true
});

horseman
  .userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36"')
  .viewport(780, 980)

.cookies({
  name: ou,
  value: ou,
  domain: '.convirza.com'
})

.open(baseURL + 'login/')
  .type('input[id="email"]', keys.cfa_email)
  .type('input[id="password"]', keys.cfa_pass)
  .click('[id="b1"]')
  .keyboardEvent('keypress', 16777221)

  .log('waiting for 2 seconds')
  .wait(2000)

.click('[id="leftmenu-trigger"]')

.pdf('horseman/' + ou + date[0] + '.pdf', {
    format: 'Tabloid',
    orientation: 'portrait',
    margin: '0.2in'
  })
  .log('PDF has been CAPTURED')

.evaluate(function() {
  $('#page-heading').append('<span> YODA IS THE FILTER APPLIED TO THE PAGE</span>');
  $('.fa-bar-chart-o').click();
  $('.navbar').hide();
  $('.page-leftbar').hide();
  $('img').hide();
})


.screenshot('horseman/' + ou + date[1] + '.png')
  .log('Screenshot has been TAKEN')

.pdf('horseman/' + ou + date[1] + '.pdf', {
    format: 'Tabloid',
    orientation: 'portrait',
    margin: '0.2in'
  })
  .log('PDF has been CAPTURED')

.crop('.col-md-9', 'horseman/' + ou + date[2] + '.png')
  .log('Cropped screenshot has been TAKEN')

// After the login accepts a cookie as auth we can use this feature to navigate the site using tabs like you would in a browser

// .openTab('baseURL + filter')

// .log('waiting for 2 seconds')
//   .wait(2000)

// .screenshot('horseman/' + ou + date[2] + '.png')
//   .log('Screenshot has been TAKEN')

.cookies()
  .then(function(cookies) {
    console.log(cookies);
    return horseman;
  })

.close();

setTimeout(function() {
  pdfconcat(['horseman/yoda1.pdf', 'horseman/yoda2.pdf'], 'horseman/Jedi.pdf', function(err) {});
  console.log('A new Jedi has been born');
}, 10000)
