import User from "../models/User.js";

// GET users from DB

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }
    }).select("-password");

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};   

