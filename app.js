var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs 		= require('fs');
var app     = express();

app.get('/latestnews', function(req, res){
	request('http://www.newshub.co.nz/home.html', function(error, response, html){
		if(!error){
			
			var $ = cheerio.load(html);
			var newsUpdates = [];
			//get news title and time posted using selector: h3.c-NewsSnippetSecondary-title 
			$('h3.c-NewsSnippetSecondary-title').each(function() {				
				 newsUpdates.push(
				 {
					title:getTextOnly($(this)), 
					description: '',
					timePosted: $(this).children().text()				
				 });
			});
			//get news description using selector: p.c-NewsSnippetSecondary-description
			$('p.c-NewsSnippetSecondary-description').each(function(index) {	
				newsUpdates[index].description = getTextOnly($(this));
			 });

			//get text inside the element
			function getTextOnly(element){
				return element.clone().children().remove().end().text().trim();		
			}
			
			var responseStr = '';
			//construct html response
			for(let i = 0; i < newsUpdates.length; i++){
				responseStr += '<li><b>' + newsUpdates[i].title + '</b> <span style="color: #666;">' 
				+ newsUpdates[i].timePosted + '</span>'
				+ '<br><p>' + newsUpdates[i].description + '</p>';
			}
			responseStr = '<ul style="list-style-type:none">' + responseStr + '</ul>';
			//write to file scraped data
			fs.writeFile('newsupdate.json', JSON.stringify(newsUpdates), function(err){
			if(!err)
				console.log("JSON file written");
			else
				console.log(err);
		});
		}

	res.send(responseStr);

	});
});

app.listen('8085')
exports = module.exports = app;