const { connectMongoDb } = require("./connectiondb")
const express = require("express")

const userRouter = require("./routes/user")
const { logReqRes } = require("./middlewares/index")

const app = express()
const PORT = 8082

// Connection
connectMongoDb("mongodb://127.0.0.1:27017/node-jan-2026").then(() => console.log("Mongo DB connected!"))

// Middleware - Plugin
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json()); 
app.use(logReqRes("log.txt"))

// Routes
app.use("/api/users", userRouter)


app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`)
});