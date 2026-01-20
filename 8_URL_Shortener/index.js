const express = require("express");
const connectToMongoDB  = require("./connectdb");
const urlRoute = require("./routes/url");
const URL = require("./models/url")

const app = express();
const PORT = 8082;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
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
