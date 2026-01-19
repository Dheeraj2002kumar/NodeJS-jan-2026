const User = require("../models/user")

async function handleGetAllUsers(req, res){
    const allDbUsers = await User.find({})
    return res.json(allDbUsers);
}

async function handlegetUserById(req, res){
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({
        error: "user not found!"
    })

    return res.json(user);
}

async function handlegetGenderByGenderName(req, res){
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
}

async function handleCreateNewUser(req, res){
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

    return res.status(201).json({ msg: "Success", id: result._id });
}

async function handleUpdateUserById(req, res){
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
}

async function handleDeleteUserById(req, res) {
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
}

module.exports = {
    handleGetAllUsers,
    handlegetUserById,
    handlegetGenderByGenderName,
    handleCreateNewUser, 
    handleUpdateUserById,
    handleDeleteUserById
}