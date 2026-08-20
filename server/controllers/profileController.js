const Profile = require("../models/Profile");

exports.getProfile = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.userId });
  res.json(profile || {});
};

exports.upsertProfile = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.userId };
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
