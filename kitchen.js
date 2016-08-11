var Horseman = require('node-horseman'),
  config = require('./config.json'),
  loot = require('./loot.json'),
  pdfconcat = require('pdfconcat'),
  json2csv = require('json2csv'),
  keys = require('./keys'),
  co = require('co'),
  fs = require('fs'),
  emailData = [],
  routes = [],
  namely = [],
  concatIt = [],
  pageAmt = [];



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
  yield horseman.includeJs('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.1/angular.js');
  yield horseman.wait(3000);
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

  yield horseman.evaluate(function(ms, done) { // Navigating to Call Details page
    $('.fa-bar-chart-o').click();
    $("span:contains('Call Logs')").click();
    $("span:contains('Details')").click();
    done(null);
  }, 1000)
  console.log('waiting ....');

  yield horseman.waitForSelector('.mb10'); // Waiting for page of selector
  yield horseman.viewport(1200, 980);

  yield horseman.evaluate(function() { // Changing date range
    $('fa-calendar').click();
    $("li:contains('Last 30 Days')").click();
  })

  yield horseman.wait(4000);

  var urlCurrent = yield horseman.url(); // Split up URL
  var cleanUrl = urlCurrent.split('?')[0];
  var route = cleanUrl.substr(cleanUrl.indexOf("#") + 2);
  routes.unshift(route);

  console.log(route); // calls-details

  var text = yield horseman.text('.mb10'); // Calculating paginated pages
  var paginationIndicator = text.split(' ').reverse();
  var page = (Math.ceil(paginationIndicator[0] / 100))

  pageAmt.unshift(page);
  var pageLogic = pageAmt[0];
  console.log('# of paginated pages: ', pageLogic); // # of paginated pages: 4

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
          namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i); //  **** NEW NAMING CONVENTION HERE

          yield horseman.crop('.panel-inverse', 'co/' + namely[0] + '.png');
          yield horseman.wait(1000);
          yield horseman.click('button:contains("Next 100")');
          console.log(config.format, i);

          yield horseman.waitForSelector('.btn-midnightblue');
        }
      } else {
        yield horseman.evaluate(function() {
          var filter = document.URL.split('?')[1];
          if (filter !== undefined) {
            $(document).ready(function() {
              $('#cdr_table').append('<span id=cleanBC>Current applied filter: ' + filter + '</span>');
            });
          }
        })
        namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour); //  **** NEW NAMING CONVENTION HERE

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

          namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour + '-' + i); //  **** NEW NAMING CONVENTION HERE
          yield horseman.pdf('co/' + namely[0] + '.pdf', {
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
          var filter = document.URL.split('?')[1];
          if (filter !== undefined) {
            $(document).ready(function() {
              $('#cdr_table').append('<span id=cleanBC>Current applied filter: ' + filter + '</span>');
            });
          }
        })
        namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour); //  **** NEW NAMING CONVENTION HERE
        yield horseman.pdf('co/' + namely[0] + '.pdf', {
          format: 'A2',
          orientation: 'portrait',
          margin: '0.2in'
        })
      }
      console.log("PDF has been captured");
      break;

    case "CSV":

      var goods = yield horseman.evaluate( function() {
        return{
          // loot: angular.element($("#page-heading")).scope().callDetailsDataReport,    // √ array of data needed for CSV
          data: angular.element($("#page-heading")).scope().csvHeaderNames

          }
        })
        namely.unshift(config.OU + '-' + routes[0] + '-' + config.frequencyInHour); //  **** NEW NAMING CONVENTION HERE

        var reportData = JSON.stringify(goods.loot)
        // console.log('The data is: ', goods.data);
        // console.log('The loot is: ', goods.loot);

        var opts = {
          data: loot,
          fields: goods.data,
          quotes: ''
        };
        var csv = json2csv(opts);

        fs.writeFile('co/'+namely[0]+'.csv', csv, function(err) {
          if (err) throw err;
        });

      console.log("CSV has been captured");
      break;

    default:
      console.log("The requested " + config.format + " format is not supported. :/");
  }

  // yield horseman.cookies()
  //   yield horseman.log(cookies);  //  Proof that the cookies work. Hazzaaa!
  //   return horseman.close();
  //   })

  yield horseman.close();
}).catch(function(data) {
  console.log(data)
});
