// import cloudinary from '../lib/cloudinary.js';

import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const getSuggestedConnections = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id).select('connections');

  // find users who are not already connected, and also do not recommend our own profile
  const suggestedUser = await User.find({
    _id: {
      $ne: req.user._id,
      $nin: currentUser.connections,
    },
  })
    .select('name username profilePicture headline')
    .limit(3);

  res.json(suggestedUser);
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    '-password'
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'username',
    'headline',
    'about',
    'location',
    'profilePicture',
    'bannerImg',
    'skills',
    'experience',
    'education',
  ];

  const updatedData = {};

  for (const field of allowedFields) {
    if (req.body[field]) {
      updatedData[field] = req.body[field];
    }
  }

  if (req.body.profilePicture) {
    const result = await cloudinary.uploader.upload(req.body.profilePicture);
    updatedData.profilePicture = result.secure_url;
  }

  if (req.body.bannerImg) {
    const result = await cloudinary.uploader.upload(req.body.bannerImg);
    updatedData.bannerImg = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedData },
    { new: true }
  ).select('-password');

  res.json(user);
});
