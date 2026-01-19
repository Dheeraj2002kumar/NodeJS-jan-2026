const fs = require("fs");

function logReqRes(filename) {
    return (req, res, next) => {
        fs.appendFile(
            filename,  // Filename goes here
            `\n${new Date().toISOString()} | ${req.ip} | ${req.method} | ${req.path}\n`,  // Log string goes here
            (err, data) => {
                if (err) {
                    console.error('Error writing to log file:', err);
                }
                next();
            }
        );
    };
}

module.exports = {
    logReqRes,
};
