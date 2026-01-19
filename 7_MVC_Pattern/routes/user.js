const express = require("express")
const { handleGetAllUsers,
     handlegetUserById, handlegetGenderByGenderName, handleCreateNewUser, handleUpdateUserById,
    handleDeleteUserById } = require("../controllers/user")

const router = express.Router();

// REST API
router.get("/", handleGetAllUsers)

router.get("/:id", handlegetUserById )

router.get("/gender/:gender", handlegetGenderByGenderName)

router.post("/", handleCreateNewUser);

// PATHCH: Update user data by id
router.patch("/:id", handleUpdateUserById);


// DELETE: Remove user by id
router.delete("/:id", handleDeleteUserById);

module.exports = router;


