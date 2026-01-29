const express = require("express");
const connectToMongoDB  = require("./connectdb");
const cookieParser = require('cookie-parser')

const URL = require("./models/url")
const ejs = require('ejs')
const path = require('path')

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter')
const userRoute = require("./routes/user")

const { restrictToLoggedinUserOnly, checkAuth }  = require("./middlewares/auth")

const app = express();
const PORT = 8082;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"));



app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute)


app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    }})

    res.redirect(entry.redirectURL)
})


app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
