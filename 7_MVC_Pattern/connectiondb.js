const mongoose = require("mongoose")

// Connection db
async function connectMongoDb(url){
    return mongoose.connect(url)
        
}

module.exports = {
    connectMongoDb,
}