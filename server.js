var http = require('http');
var fs = require('fs');
var static = require('node-static');
var file = new static.Server('.', {
  cache: 0
});

function accept(req, res) {
	let a = req.url;

	if (a == '/' 
		|| a == '/news' 
		|| a == '/eventsPhotos'
		|| a == '') {
    	fs.readFile('./index.html', (err,data) => {
    		res.writeHead(200,{'Content-Type': 'text/html'});
    		res.end(data);
    	});

	} else {
    	file.serve(req, res);
	}
}

http.createServer(accept).listen(8080);

console.log('Server running on port 8080');
