// I need a function that can replace the current pdfUnite method
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


//  I need a function that can take in a number variable
//  It needs to capture the view in PDF & PNG formats
//  Then Click and repeat the capture as many times as the variable indicates


// switch statement that takes in format of report as well as report page. **this is due to the method in which the crawler is currently functioning
//  needing a statement for the report page will be unecessary because instead of crawling to it we will just pass in the URL and open it.
