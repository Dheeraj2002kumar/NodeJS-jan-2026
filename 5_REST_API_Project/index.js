const express = require("express")
const fs = require("fs")
const users = require('./MOCK_DATA.json')
 
const app = express()
const PORT = 8082

// Middleware - Plugin
app.use(express.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${new Date().toISOString()} | ${req.ip} | ${req.path} `, (err, data) => {
        next();
    })
})

// Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name} ${user.last_name}</li>`).join("")}
    </ul>
    `;

    res.send(html)
})

// REST API
app.get("/api/users", (req, res) => {
    res.setHeader("x-MyName", "Dheeraj Kumar") // Custom Header
    // Always add X to custom header

    return res.json(users);
})

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    
    if (!user) return res.status(404).json({
        error: "user not found!"
    })

    return res.json(user);
})

// Dynamic Route for Gender (return all user with the specified gender)
app.get("/api/users/gender/:gender", (req, res) => {
    const gender = req.params.gender.toLowerCase(); // lowercase for consistency

    const filteredUsers = users.filter((user) => user.gender.toLowerCase() === gender)

    if (filteredUsers.length > 0){
        return res.json(filteredUsers)
    } else{
        return res.status(404).json({
            message: `No users found with gender ${gender}`
        });
    }
})

app.post("/api/users", (req, res) => {
    // TODO: Create new user
    const body = req.body;

    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({
            msg: "All fields are required..."
        })
    }

    const newUser = { id: users.length + 1, ...body }
    users.push(newUser)

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if(err) {
            return res.status(500).json({ message: "Error saving user" })
        }
        return res.status(201).json({
            status: "Success", 
            id: users.length,
        });
    });
});

// PATHCH: Update user data by id
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);  // Extract the user id from the URL
    const userIndex = users.findIndex((user) => user.id === id);  // Find user index by id

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update the user's data with the fields from the request body
    const updatedUser = {
        ...users[userIndex],  // Retain existing user data
        ...req.body  // Override only the fields provided in the body
    };

    users[userIndex] = updatedUser;  // Replace the user in the array with updated data

    // Log the updated users array to check if the change is in memory
    console.log('Updated Users Array:', users);

    // Save updated users array to the MOCK_DATA.json file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file:", err);  // Log error if any
            return res.status(500).json({ message: "Error saving updated user" });
        }

        console.log("File updated successfully!");  // Confirm file was written
        return res.json({
            status: "Success",
            updatedUser,  // Return the updated user data
        });
    });
});


// DELETE: Remove user by id
app.delete("/api/users/:id", (req, res) => {
    // TODO: Delete the user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if(userIndex === -1){
        return res.status(404).json({
            message: "User not found"
        });
    };

    // remove the user from the array
    users.splice(userIndex, 1);

    // save updated users array
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err){
            return res.status(500).json({
                message: "Error deleting user"
            });
        }

        return res.json({
            status: "Sucees",
            message: "User delete successfully",
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`)
});