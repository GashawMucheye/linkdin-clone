import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  // Get notifications for the current user
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .populate('relatedUser', 'name username profilePicture')
    .populate('relatedPost', 'content image');

  res.status(200).json(notifications);
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  // Mark the notification as read by the current user
  const notificationId = req.params.id;

  const notification = await Notification.findByIdAndUpdate(
    { _id: notificationId, recipient: req.user._id },
    { read: true },
    { new: true }
  );

  res.json(notification);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  // delete notification of current user
  const notificationId = req.params.id;

  await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: req.user._id,
  });

  res.json({ message: 'Notification deleted successfully' });
});
