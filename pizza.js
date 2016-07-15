// Grab links from Google.
var Horseman = require("node-horseman");

var baseURL = 'https://cfa.convirza.com/#/';

var keys = require('./keys');

var horseman = new Horseman();

var crumbs = [];

function getCrumb(){
	return horseman.evaluate( function(){
		// This code is executed in the browser.
		var crumbs = [];
		$("#gwt-debug--nav-drawer-title-AGENCY").each(function( item ){
			var crumb = {
				title : $(this).text()
			};
			crumbs.push(crumb);
		});
		return crumbs;
	});
}

// function hasNextPage(){
// 	return horseman.exists("#pnnext");
// }

function scrape(){

	return new Promise( function( resolve, reject ){
		return getCrumb()
		.then(function(newCrumbs){

			crumbs = crumbs.concat(newCrumbs);

			// if ( crumbs.length < 30 ){
			// 	return hasNextPage()
			// 	.then(function(hasNext){
			// 		if (hasNext){
			// 			return horseman
			// 			  .click("#pnnext")
			// 				.wait(1000)
			// 				.then( scrape );
			// 		}
			// 	});
			// }
		})
		.then( resolve );
	});
}

horseman
	.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
  .open(baseURL + 'login/')
    .type('input[id="email"]', keys.cfa_email)
    .type('input[id="password"]', keys.cfa_pass)
    .click('[id="b1"]')
    .keyboardEvent('keypress', 16777221)
	.wait(2000)
	.then( scrape )
  .log(crumb)
	.finally(function(){
		console.log(crumbs.length)
		horseman.close();
	});
