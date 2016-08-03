
function pdfUnite() {
  return horseman.do(function(done) {

var namelyOrdered = namely.reverse();

pdfconcat(['co/' + namelyOrdered[0] + '.pdf', 'co/' + namelyOrdered[1] + '.pdf', 'co/' + namelyOrdered[2] + '.pdf', 'co/' + namelyOrdered[3] + '.pdf', 'co/' + namelyOrdered[4] + '.pdf'], 'co/Jedi.pdf', function(err) {
      err ? console.log(err) : console.log('A new Jedi has been born');
    });
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

// **** Maybe push naming convention to array so that it can be injected into pdfconcat
// **** Concatinate PDF's after the for loop has run

// **** Need to make a class specific to spot where the filter will append to.
// **** Need to make a class specific to what the cropped image will be.

// **** Grab specific HTML elements to use in HTML email. Something to add some "Flare"

// **** Maybe make the folder be dynamic to the S3 bucket.
// not sure about this one....
