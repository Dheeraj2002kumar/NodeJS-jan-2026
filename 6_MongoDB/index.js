const express = require("express")
const fs = require("fs")
const mongoose = require('mongoose')

// const users = require('./MOCK_DATA.json')
const { timeStamp } = require("console")

const app = express()
const PORT = 8082

// Connection db
mongoose.connect("mongodb://127.0.0.1:27017/node-jan-2026")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error", err))

// Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    }
}, { timestamps: true })

const User = mongoose.model("user", userSchema)

// Middleware - Plugin
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json()); // parse JSON requests

app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${new Date().toISOString()} | ${req.ip} | ${req.path} `, (err, data) => {
        next();
    })
})

// Routes
app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({})

    const html = `
    <ul>
        ${allDbUsers.map((user) => `<li>${user.firstName} ${user.lastName} - ${user.email}</li>`).join("")}
    </ul>
    `;

    res.send(html)
})

// REST API
app.get("/api/users", async (req, res) => {
    const allDbUsers = await User.find({})

    res.setHeader("x-MyName", "Dheeraj Kumar") // Custom Header
    // Always add X to custom header

    return res.json(allDbUsers);
})

app.get("/api/users/:id", async (req, res) => {
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({
        error: "user not found!"
    })

    return res.json(user);
})

// Dynamic Route for Gender (return all user with the specified gender)
app.get("/api/users/gender/:gender", async (req, res) => {
    const gender = req.params.gender.toLowerCase(); // lowercase for consistency

    const filteredUsers = await User.find({
        gender: { $regex: gender, $options: "i" }, // case-insensitive search
    });

    if (filteredUsers.length > 0) {
        return res.json(filteredUsers)
    } else {
        return res.status(404).json({
            message: `No users found with gender ${gender}`
        });
    }
})

app.post("/api/users", async (req, res) => {
    // TODO: Create new user
    const body = req.body;

    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json({
            msg: "All fields are required..."
        })
    }

    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,   
    });

    console.log("Result", result);

    return res.status(201).json({ msg: "Success"});

});

// PATHCH: Update user data by id
app.patch("/api/users/:id", async (req, res) => {
    const userId = req.params.id;  // Extract the user id from the URL

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,   // return the updated document
    })  

    if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json({
        status: "Success",
        updateUser,
    });
});


// DELETE: Remove user by id
app.delete("/api/users/:id", async (req, res) => {
    // TODO: Delete the user with id
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        return res.status(404).json({
            message: "User not found"
        });
    };

    return res.json({
        status: "Sucees",
        message: "User delete successfully",
    });
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`)
});