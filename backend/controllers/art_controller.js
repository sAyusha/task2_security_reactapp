const Art = require('../models/art');
const User = require('../models/user');
const path = require("path");
const fs = require("fs");

const getAllArts = async (req, res, next) => {
  try {
    const arts = await Art.find().sort({ createdAt: -1 });
    res.json({
      data: arts,
    });
  } catch (error) {
    next(error);
  }
};

// Get all art posts
const getArtsUploadedByOtherUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const userInfo = await User.findById(loggedInUserId);
    const arts = await Art.find();

    // Get the current date and time
    const currentTime = new Date();

    const otherArts = arts.map((art) => {
      const isSaved = userInfo.savedArts.includes(
        art.id.toString()
      );

      const isAlert = userInfo.alerts.includes(
        art.id.toString()
      );

      // Access the virtual property 'localEndingDate', 'localUpcomingDate' of the art object to trigger its computation
      const localEndingDate = art.localEndingDate;
      const localUpcomingDate = art.localUpcomingDate;

      // Check if the art has expired (ending date is in the past)
      const artExpired = art.endingDate < currentTime;
      return {
        ...art.toObject(),
        isUserLoggedIn: loggedInUserId === art.user._id.toString(),
        isSaved: isSaved,
        isAlert: isAlert,
        localEndingDate, // Include the 'localEndingDate' in the response
        localUpcomingDate, // Include the 'localUpcomingDate' in the response
        artExpired, // Include the 'artExpired' status in the response
      };
    });

    const otherArtsUploadedBy = otherArts.filter(
      (art) => {
        return art.user && art.user._id !== loggedInUserId;
      });
    res.json({ data: otherArtsUploadedBy });

  }
  catch (error) {
    next(error)
  }
};

// Get arts uploaded by current user
const getArtsUploadedByCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const arts = await Art.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json({
      data: arts,
    });
  } catch (error) {
    next(error);
  }
};

//Create a new art post
const createArtPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // const { title, creator, description, startingBid, artType, upcomingDate } = req.body;
    const { title, creator, description, startingBid, endingDate, artType, upcomingDate, categories } = req.body;

    // Use the uploadedFilename from the shared variable
    const image = uploadedFilename || "";

    if (!title || !creator || !description || !startingBid || !artType || !categories) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Sanitize and prepare the data for creating an art post
    const artData = {
      image,
      title,
      creator,
      description,
      startingBid,
      artType,
      categories,
      user: userId, // Assign the user's ID to the art's user field
    };

    if (artType === "Recent") {
      artData.endingDate = endingDate || Date.now();
    }
    if (artType === "Upcoming") {
      artData.upcomingDate = upcomingDate || Date.now();
    }

    const art = await Art.create(artData);
    // Access the virtual property 'localEndingDate', 'localUpcomingDate' of the art object to trigger its computation
    const localEndingDate = art.localEndingDate;
    const localUpcomingDate = art.localUpcomingDate;

    // Include 'localEndingDate', 'localUpcomingDate' in the response JSON
    const responseData = {
      ...art.toJSON(),
      localEndingDate,
      localUpcomingDate,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  } finally {
    uploadedFilename = undefined; // Reset the shared variable after use
  }
};


//Delete all art post
const deleteAllArtPosts = async (req, res, next) => {
  try {
    await Art.deleteMany();
    res.json({ message: 'All art posts have been deleted' });
  } catch (error) {
    next(error);
  }
};

//Search art
const searchArts = (req, res, next) => {
  const { query } = req.query;

  Art.find({
    $and: [
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { creator: { $regex: query, $options: "i" } },
          { categories: { $regex: query, $options: "i" } },
        ],
      },
      { artType: "Recent" },
    ],
  })
    .then((arts) => {
      if (arts.length === 0) {
        // No arts found
        res.json({ message: "No art posts found" });
      } else {
        // Matching arts found
        res.json({ data: arts });
      }
    })
    .catch((error) => {
      next(error);
    });
};


// Save art post
const saveArtPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const artId = req.params.art_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.savedArts.includes(artId)) {
      return res.status(400).json({ error: "Art is already saved" });
    }

    user.savedArts.push(artId);
    await user.save();

    res.status(201).json({ message: "Art saved successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove saved art post
const removeSavedArtPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const artId = req.params.art_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.savedArts.includes(artId)) {
      return res.status(400).json({ error: "Art is not saved" });
    }

    user.savedArts = user.savedArts.filter(
      (save) => save.toString() !== artId
    );
    await user.save();

    res.json({ message: "Saved art removed successfully" });
  } catch (error) {
    next(error);
  }
};

// get all saved arts
const getAllSavedArts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by userId and populate the saved arts field
    const user = await User.findById(userId).populate("savedArts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedArts = await Art.find({
      _id: { $in: user.savedArts },
    });

    res.status(200).json({ data: savedArts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Alert art post
const alertArtPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const artId = req.params.art_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the art by its ID and check if it exists
    const art = await Art.findById(artId);
    if (!art) {
      return res.status(404).json({ error: "Art not found" });
    }


    // Check if the user who posted the art is the same as the user trying to alert it
    if (art.user.toString() === userId) {
      return res.status(400).json({ error: "You cannot alert your own art" });
    }

    if (user.alerts.includes(artId)) {
      return res.status(400).json({ error: "Art has already been alerted" });
    }

    user.alerts.push(artId);
    await user.save();

    return res.json({ message: "Art alerted successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove alereted art post
const removeAlertedArtPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const artId = req.params.art_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.alerts.includes(artId)) {
      return res.status(400).json({ error: "Art has not been alerted" });
    }

    user.alerts = user.alerts.filter(
      (alert) => alert.toString() !== artId
    );
    await user.save();

    return res.json({ message: "Alerted art removed successfully" });
  } catch (error) {
    next(error);
  }
};

// get all alerted arts
const getAllAlertedArts = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const userId = req.user.id;

    // Find the user by userId and populate the saved arts field
    const user = await User.findById(userId).populate("alerts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alerts = await Art.find({
      _id: { $in: user.alerts },
    });

    res.status(200).json({ data: alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get art by id
const getArtById = (req, res, next) => {
  Art.findById(req.params.art_id)
    .then((art) => {
      if (!art) {
        res.status(404).json({ error: "art not found" });
      }
      res.json({data: [art]});
    })
    .catch(next);
};

// Update art by id
const updateArtById = async (req, res, next) => {
  try {
    const artId = req.params.art_id;
    const { startingBid, title: updatedTitile } = req.body;

    const art = await Art.findById(artId);
    if (!art) {
      return res.status(404).json({ error: "Art not found" });
    }

    // Check if the current time is greater than the expiration date
    await art.checkAndUpdateExpirationStatus();
    if (art.artExpired) {
      return res.status(403).json({ error: "Art has expired and cannot be updated" });
    }

    art.startingBid = startingBid;
    art.title = updatedTitile;

    await art.save();

    res.status(201).json({
      message: "Art updated successfully",
      data: art,
    })


    // // Set the upcomingDate based on the artType
    // const updatedArtFields = {
    //   ...updatedFields,
    //   // upcomingDate: artType === 'upcoming' ? upcomingDate || Date.now() : null,
    // };

    // const updatedArt = await Art.findByIdAndUpdate(artId, updatedArtFields, { new: true });
    res.json(updatedArt);
  } catch (error) {
    next(error);
  }
};


// Delete art by id
const deleteArtById = async (req, res, next) => {
  console.log(req.params.art_id);
  Art.findByIdAndDelete(req.params.art_id)
    .then((art) => {
      if (art != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          art.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            message: "Art deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          message: "Art not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

let uploadedFilename; // shared variable to store the uploaded file name

// Upload single image
const uploadArtPicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    // Save the art cover image and get the filename
    const image = req.file.filename;

    uploadedFilename = image; // Store the filename in the shared variable

    res.status(200).json({ data: image });
  } catch (error) {
    next(error);
  }
};

// get users with the most arts sorted in descending order
const getAllUsers = async (req, res, next) => {
  try {
    // Use aggregation to get all users and count the number of uploaded arts for each user
    const users = await User.aggregate([
      {
        $lookup: {
          from: "arts", // The name of the collection for the Art model
          localField: "_id", // Use the correct local field (_id field in the User model)
          foreignField: "user", // Use the correct foreign field (user field in the Art model)
          as: "uploadedArtsData",
        },
      },
      {
        $addFields: {
          uploadedArtsCount: { $size: "$uploadedArtsData" },
        },
      },
      {
        $sort: { uploadedArtsCount: -1 }, // Sort users based on the uploadedArtsCount in descending order
      },
    ]);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArts,
  getArtsUploadedByOtherUsers,
  getArtsUploadedByCurrentUser,
  createArtPost,
  deleteAllArtPosts,
  searchArts,
  saveArtPost,
  removeSavedArtPost,
  getAllSavedArts,
  alertArtPost,
  removeAlertedArtPost,
  getAllAlertedArts,
  getArtById,
  updateArtById,
  deleteArtById,
  uploadArtPicture,
  getAllUsers,
}