# Crawl The Web

## How to use it
You will need to:
- install [phantomJS](http://phantomjs.org/), [casperJS](http://casperjs.org/), [horseman](http://www.horsemanjs.org/)


- run `npm install`
- uncomment the methods you want to use
- run `casperjs casperCrawl.js` in your terminal for CasperJS methods
- run `phantomjs menace.js` in your terminal for PhantomJS methods
- run `node report` in your terminal for node-horseman methods


## Use Case
Create snapshots of rendered websites and convert them into PNG & PDF formats.


### Resources
Most of the methods used can be found on [casperJS](http://docs.casperjs.org/en/latest/modules/casper.html) &
[horseman](https://github.com/johntitus/node-horseman)

### Todo's

  * Branch out examples to their own JS files.
  * Verify logging in with a cookie actually works
  * Automatize the naming of files created to be unique
  * Make pdfUnite method for horseman (inject the generated files and return a multi-paged PDF)
  * Save files in S3
