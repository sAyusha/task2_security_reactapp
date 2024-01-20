const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Bid = require("../models/bid")
const path = require("path");
const fs = require("fs");

// register method
const registerUser = async (req, res, next) => {
  const { username, password, fullname, email, phone } = req.body;

  try {
    // Check for empty fields
    if (!username || !password || !fullname || !email || !phone) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    // Check for password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~\\-])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must include a combination of Uppercase letters, Lowercase letters, Numbers, Special characters (e.g., !, @, #, $)",
      });
    }

    // Check for phone number length
    // const minimum = 10;
    if (phone.length < 10 && phone.length > 10) {
      return res.status(400).json({
        error: `Phone number should at least be ${minLength} numbers.`,
      });
    }
    // Check for password length
    const minLength = 8;
    if (password.length < minLength) {
      return res.status(400).json({
        error: `Password length should be at least ${minLength} characters.`,
      });
    }

    const existingPhoneNo = await User.findOne({ phone: phone });
    if (existingPhoneNo) {
      return res.status(400).json({ error: "phone number is already in use" });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: "Duplicate username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      fullname,
      email,
      phone,
    });

    // Update password history for the newly registered user
    user.passwordHistory.push(hashedPassword);
    // Trim the password history to a specific depth (e.g., last 5 passwords)
    const passwordHistoryDepth = 5;
    user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);

    await user.save();

    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    next(error);
  }
};


// login method
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    console.log(user);

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!user) {
      return res.status(400).json({ error: "User is not registered" });
    }

    // Check if the account is locked
    if (user.accountLocked) {
      // Check if it's time to unlock the account
      const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
      const lockoutDurationSeconds = lockoutDurationMillis / 1000; // convert to seconds

      if (lockoutDurationSeconds >= 120) {
        // 2 minutes in seconds
        // Unlock the account
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        // Calculate the time remaining for the account lockout period
        const timeRemainingSeconds = 120 - lockoutDurationSeconds;
        const minutes = Math.floor(timeRemainingSeconds / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);

        return res.status(400).json({
          error: `Account is locked. Please try again later after ${minutes} minutes and ${seconds} seconds.`,
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts and update last failed login timestamp
      user.failedLoginAttempts += 1;
      user.lastFailedLoginAttempt = Date.now();

      // Check if the maximum allowed failed attempts is reached
      if (user.failedLoginAttempts >= 4) {
        // Lock the account
        user.accountLocked = true;
        await user.save();
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }

      // Save the updated user data
      await user.save();

      return res.status(400).json({ error: "Password does not match" });
    }

    // Reset failed login attempts and last failed login timestamp on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttempt = null;
    await user.save();

    // Check if the account is still locked after successful login
    if (user.accountLocked) {
      return res
        .status(400)
        .json({ error: "Account is locked. Please try again later." });
    }

    // If everything is fine, generate and send the JWT token
    const payload = {
      id: user.id,
      // id: user._id,
      username: user.username,
      // fullname: user.fullname,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: process.env.JWT_EXPIRE }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: "success", token: token, user: user });
    });
  } catch (error) {
    next(error);
  }
};

// get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Use req.user._id if this holds the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      data: [user],
    });
  } catch (error) {
    next(error);
  }
};

// get all users
const getAllUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

// get current user
const getCurrentUser = async (req, res, next) => {
  const currentUser = req.user;

  res.status(200).json({
    data: currentUser
  });
};

// get user by id
const getUserInfoById = async (req, res, next) => {
  // const userId = req.user.id;
  const userId = req.params.user_id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ data: [user] });
    // res.json(user);
  } catch (error) {
    next(error);
  }
};

// delete user
const deleteUser = async (req, res, next) => {
  console.log(req.params.user_id);
  User.findByIdAndDelete(req.params.user_id)
    .then((user) => {
      if (user != null) {
        var imagePath = path.join(
          __dirname,
          "../public/uploads/" + user.image
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            message: "User deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

//update user profile
const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { fullname, username, email, phone, bio } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the fields only if they are different from the existing values
    if (fullname && fullname !== "" && fullname !== user.fullname) {
      user.fullname = fullname;
    }
    if (username && username !== "" && username !== user.username) {
      const existingUserWithUsername = await User.findOne({
        username: username,
      });
      if (existingUserWithUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      user.username = username;
    }
    if (email && email !== "" && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: email });
      if (existingUserWithEmail) {
        return res.status(400).json({ error: "Email is already taken" });
      }
      user.email = email;
    }
    if (phone !== undefined && phone !== user.phone) {
      const existingUserWithPhone = await User.findOne({
        phone: phone,
      });
      if (existingUserWithPhone) {
        return res.status(400).json({ error: "Phone number is already taken" });
      }
      user.phone = phone;
    }
    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.json({
      data: [updatedUser]
    });
  } catch (error) {
    // console.error("Error updating user profile:", error); // Log any errors for debugging
    next(error);
  }
};

// Upload single image
let uploadedFilename;
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Update the user's profile picture in the database
    const userId = req.user.id;
    const profileImage = req.file.filename;

    User.findByIdAndUpdate(userId, { profileImage })
      .then(() => {
        res.status(200).json({
          success: true,
          data: profileImage,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Failed to update the user's profile picture",
        });
      });
  }
  catch (error) {
    next(error);
  }
};

// change password
const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password",
      });
    }


    // Check if the new password is in the password history
    const isPasswordInHistory = await Promise.all(
      user.passwordHistory.map(async (oldPassword) => {
        return await bcrypt.compare(newPassword, oldPassword);
      })
    );

    if (isPasswordInHistory.includes(true)) {
      return res.status(400).json({
        error: "New password cannot be one of the recent passwords",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the new password change date
    user.password = hashedNewPassword;
    user.passwordChangeDate = new Date();

    // Save the updated user
    await user.save();

    // Update the password history
    user.passwordHistory.push(hashedNewPassword);
    // Trim the password history to a specific depth (e.g., last 5 passwords)
    const passwordHistoryDepth = 5;
    user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);

    await user.save();

    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// logout controller
const logoutUser = async (req, res, next) => {
  try {
    req.logout();
    res.json({ status: "success", message: "User logged out" });
  } catch (error) {
    next(error);
  }
};

const getBidStatus = async (req, res, next) => {
  const userId = req.params.user_id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming the bidStatus is a field in the user schema
    const bidStatus = user.bidStatus;

    res.json({ bidStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  getUserInfoById,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  updatePassword,
  logoutUser,
  getBidStatus,
}
