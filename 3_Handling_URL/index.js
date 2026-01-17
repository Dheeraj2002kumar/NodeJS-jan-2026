const http = require("http")
const fs = require("fs")
const url = require("url")

const Server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico'){
        res.writeHead(204)
        return res.end();
    }

    const log = `${new Date().toISOString()} | ${req.method} | ${req.url}\n`;

    const myUrl = url.parse(req.url, true); // parseQueryString
    console.log(myUrl)

    fs.appendFile("log.txt", log, (err, data) => {
        switch(myUrl.pathname){
            case "/":
                res.end("Home Page")
                break;
            
            case "/about":
                const username = myUrl.query.myname;
                res.end(`Hi, ${username.toUpperCase()}`)
                break

            case "/search":
                const search = myUrl.query.search_query;
                res.end(`Here are your results for ${search}`)
                break;

            default:
                res.end("404 Not Found")
        }
    });

});

Server.listen(8082, () => {
    console.log(`Server runnig at http://localhost:8082`);
})