const http = require('http')
const fs = require("fs")
const path = require("path")

const PORT = 8082;
const logFile = path.join(__dirname, "log.txt")

const server = http.createServer((req, res) => {
    // Ignore favicon requests
    if (req.url === "/favicon.ico"){
        res.writeHead(204)  // No Content (favicon)
        return res.end();
    }

    const log = `${new Date().toISOString()} | ${req.method} | ${req.url}\n`;

    fs.appendFile(logFile, log, (err) => {
        if (err){
            console.err("Logging failed:", err);
        }
    });

    res.setHeader("Content-Type", "text/plain");

    // Route handling
    if (req.method === "GET"){
        switch(req.url){
            case "/":
                res.writeHead(200); // OK
                res.end("Home Page")
                break

            case "/about":
                res.writeHead(200)
                res.end("About Page")
                break

            default:
                res.writeHead(404) // Note Found
                res.end("404 Not Found")
        }
    } else{
        res.writeHead(405)  // Method Not Allowed
        res.end("Method Not Allowed")
    }
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});











// =========Basic http server =============

// const http = require('http')
// const fs = require('fs')

// const myServer = http.createServer((req, res) => {
//     const log = `${Date.now()}: ${req.url} New Request Received\n\n`

//     fs.appendFile("log.txt", log, (err, data) => {
//         switch (req.url){
//             case "/":
//                 res.end("Home Page")
//                 break;
//             case "/about":
//                 res.end("About Page")
//                 break
//             default:
//                 res.end("404 Not Found")
//         }
//     });
// });

// myServer.listen(8082, () => console.log("Server running at 8082"))