var Horseman = require('node-horseman'),
  config = require('./config.json'),
  pdfconcat = require('pdfconcat'),
  keys = require('./keys'),
  co = require('co'),
  emailData = [],
  routes = [],
  namely= [],
  concatIt = [],
  pageAmt = [];


////////////////////////
/// Helper Functions ///
////////////////////////

//  Joins multiple single paged PDF's into a single multi-paged PDF. (Say that five times fast)
function pdfUnite() {
  return horseman.do(function(done) {
    pdfconcat(['co/' + namely[0] + '.pdf', 'co/' + namely[1] + '.pdf', 'co/' + namely[2] + '.pdf', 'co/' + namely[3] + '.pdf', 'co/' + namely[4] + '.pdf'], 'co/Jedi.pdf', function(err) {
      err ? console.log(err) : console.log('A new Jedi has been born');
    });
    setTimeout(done, 100);
  })
}

//  horseman options can be added & set within this object
var horseman = new Horseman({
  switchToNewTab: true,
  timeout: 30000
});

horseman
  .userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2790.0 Safari/537.36"')

co(function*() {
  yield horseman.cookies({
    name: config.cookie.name,
    value: config.cookie.value,
    domain: config.cookie.domain
  })
  yield horseman.viewport(780, 980);
  yield horseman.open(config.baseURL + 'login/');
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

  ////////////////////////
  //// Call Details //////
  ////////////////////////

  yield horseman.evaluate(function(ms, done) {  // Navigating to Call Details page
    $('.fa-bar-chart-o').click();
    $("span:contains('Call Logs')").click();
    $("span:contains('Details')").click();
    done(null);
  }, 1000)
  console.log('waiting ....');

  yield horseman.waitForSelector('.mb10'); // Waiting for page of selector
  yield horseman.viewport(1200, 980);

  yield horseman.evaluate(function() {  // Changing date range
    $('fa-calendar').click();
    $("li:contains('Last 30 Days')").click();
  })

  yield horseman.wait(4000);

  var urlCurrent = yield horseman.url();  // Split up URL
  var cleanUrl = urlCurrent.split('?')[0];
  var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
  routes.unshift(route);

  console.log(route); // calls-details

  var text = yield horseman.text('.mb10');  // Calculating paginated pages
  var paginationIndicator = text.split(' ').reverse();
  var page = (Math.ceil(paginationIndicator[0] / 100))

  pageAmt.unshift(page);
  var pageLogic = pageAmt[0];
  console.log('# of paginated pages: ', pageLogic); // # of paginated pages: #

  switch (config.format) {

    case "HTML":
      if (pageLogic > 1) {
        for (var i = 1; pageLogic >= i; i++) {
          yield horseman.evaluate(function() {
            var filter = document.URL.split('?')[1];
            if (filter !== undefined) {
              $(document).ready(function() {
                $('#cdr_table').append('<span id=cleanBC>Current applied filter: ' + filter + '</span>');
              });
            }
          })
          namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i);    //  **** NEW NAMING CONVENTION HERE

          yield horseman.crop('.panel-inverse', 'co/' + namely[0] + '.png');
          yield horseman.wait(1000);
          yield horseman.click('button:contains("Next 100")');
          console.log(config.format, i);

          yield horseman.waitForSelector('.btn-midnightblue');
        }
      } else {
        yield horseman.evaluate(function() {
          var cleanUrl = document.URL.split('?')[1];
          var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
          $('#page-heading').append('<span id=cleanBC>Current applied filter: ' + cleanUrl + '</span>');
        })
        namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i);    //  **** NEW NAMING CONVENTION HERE

        yield horseman.crop('.panel-inverse', 'co/' + namely[0] + '.png');
      }
      console.log("HTML has been captured");
      break;

    case "PDF":
    if (pageLogic > 1) {
      for (var i = 1; pageLogic >= i; i++) {
        yield horseman.evaluate(function() {
          var filter = document.URL.split('?')[1];
          if (filter !== undefined) {
            $(document).ready(function() {
              $('#cdr_table').append('<span id=cleanBC>Current applied filter: ' + filter + '</span>');
            });
          }
        })


            namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i);     //  **** NEW NAMING CONVENTION HERE
        yield horseman.pdf('co/' +namely[0]+'.pdf', {
          format: 'A2',
          orientation: 'portrait',
          margin: '0.2in'
        })
        yield horseman.wait(1000);
        yield horseman.click('button:contains("Next 100")');
        console.log(config.format, i);

        yield horseman.waitForSelector('.btn-midnightblue');
      }

      //  **** PDF CONCAT HERE
      yield horseman.do(function(done) {

        var namelyOrdered = namely.reverse();
        function fileNamesToConcat(element) {
          concatIt.push('co/' + element + '.pdf');
        }
        namelyOrdered.forEach(fileNamesToConcat);

          pdfconcat(concatIt, 'co/Jedi.pdf', function(err) {
            err ? console.log(err) : console.log('A new Jedi has been born');
          });
          setTimeout(done, 100);
        })

    } else {
      yield horseman.evaluate(function() {
        var cleanUrl = document.URL.split('?')[1];
        var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
        $('#page-heading').append('<span id=cleanBC>Current applied filter: ' + cleanUrl + '</span>');
      })
      namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i);      //  **** NEW NAMING CONVENTION HERE
      yield horseman.pdf('co/' +namely[0]+ '.pdf', {
        format: 'A2',
        orientation: 'portrait',
        margin: '0.2in'
      })
    }
      console.log("PDF has been captured");
      break;

    case "CSV":
    yield horseman.download(config.baseURL, csv.csv)
    //     Download the contents of url.
    //     If path is supplied the contents will be written there, otherwise this gets the contents.
    //     If binary is true it gets the contents as a node Buffer, otherwise it gets them as a string (binary defaults to false).
      console.log("May or may not have been captured");
      break;

    default:
      console.log("The requested " + config.format + " format is not supported. :/");
  }

  yield horseman.close();
}).catch(function(data) {
  console.log(data)
});
