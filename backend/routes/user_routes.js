const express = require("express");
const router = express.Router();
// const auth = require("../middlewares/auth");
const userController = require('../controllers/user_controller');
const { verifyUser } = require("../middlewares/auth");
const upload = require('../middlewares/uploads');

router.post("/uploadProfilePicture",verifyUser, upload, userController.uploadProfilePicture);

router.post("/login", userController.loginUser);

router.post("/register", userController.registerUser);

// router.get('/test', auth, function(req, res){
//     res.status(200).send({success:true, msg: "authenticated"})
// })

//Get all users
router.get("/getAllUsers", userController.getAllUsers);

// Get user profile
router.get("/", verifyUser, userController.getUserProfile);
  
// Get current user
router.get("/getCurrentUser", verifyUser, userController.getCurrentUser);
  
//Delete user
router.delete("/deleteUser/:user_id", verifyUser, userController.deleteUser);

//Get user info from user id
router.get("/:user_id", userController.getUserInfoById);

//Update user profile
router.put("/editProfile", verifyUser, userController.updateUserProfile);

//Update password
router.put("/updatePassword", verifyUser, userController.updatePassword);

// User logout
router.get("/logout", userController.logoutUser);

// Define the route to fetch bid status for a user
router.get('/:user_id/bidstatus', userController.getBidStatus);

module.exports = router;
