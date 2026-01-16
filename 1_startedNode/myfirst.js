let http = require('http')

http.createServer(function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8084, console.log("Server running port ", 8084))