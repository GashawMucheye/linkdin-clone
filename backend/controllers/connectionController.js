import asyncHandler from 'express-async-handler';
import ConnectionRequest from '../models/connectionRequestModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import { createConnectionAcceptedEmailTemplate } from '../emails/emailTemplates.js';

const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const senderId = req.user._id;

  if (senderId.toString() === userId) {
    return res
      .status(400)
      .json({ message: "You can't send a request to yourself" });
  }

  if (req.user.connections.includes(userId)) {
    return res.status(400).json({ message: 'You are already connected' });
  }

  const existingRequest = await ConnectionRequest.findOne({
    sender: senderId,
    recipient: userId,
    status: 'pending',
  });

  if (existingRequest) {
    return res
      .status(400)
      .json({ message: 'A connection request already exists' });
  }

  const newRequest = new ConnectionRequest({
    sender: senderId,
    recipient: userId,
  });

  await newRequest.save();
  res.status(201).json({ message: 'Connection request sent successfully' });
});

const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  const request = await ConnectionRequest.findById(requestId)
    .populate('sender', 'name email username')
    .populate('recipient', 'name username');

  if (!request) {
    return res.status(404).json({ message: 'Connection request not found' });
  }

  if (request.recipient._id.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: 'Not authorized to accept this request' });
  }

  if (request.status !== 'pending') {
    return res
      .status(400)
      .json({ message: 'This request has already been processed' });
  }

  request.status = 'accepted';
  await request.save();

  await User.findByIdAndUpdate(request.sender._id, {
    $addToSet: { connections: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { connections: request.sender._id },
  });

  const notification = new Notification({
    recipient: request.sender._id,
    type: 'connectionAccepted',
    relatedUser: userId,
  });
  await notification.save();

  res.json({ message: 'Connection accepted successfully' });

  // Email sending is best effort

  const senderEmail = request.sender.email;
  const senderName = request.sender.name;
  const recipientName = request.recipient.name;

  const profileUrl =
    process.env.CLIENT_URL + '/profile/' + request.recipient.username;

  transporter
    .sendMail(
      defineMailOptions(
        senderEmail,
        'Connection Request Accepted',

        createConnectionAcceptedEmailTemplate(
          senderEmail,
          senderName,
          recipientName,
          profileUrl
        )
      )
    )
    .then((info) =>
      console.log('connection accepted email sent to:', info.response)
    )
    .catch((err) =>
      console.error('Error sending connection accepted email:', err)
    );
});

const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  const request = await ConnectionRequest.findById(requestId);

  if (request.recipient.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: 'Not authorized to reject this request' });
  }

  if (request.status !== 'pending') {
    return res
      .status(400)
      .json({ message: 'This request has already been processed' });
  }

  request.status = 'rejected';
  await request.save();

  res.json({ message: 'Connection request rejected' });
});

const getConnectionRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await ConnectionRequest.find({
    recipient: userId,
    status: 'pending',
  }).populate('sender', 'name username profilePicture headline connections');

  res.json(requests);
});

const getUserConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate(
    'connections',
    'name username profilePicture headline connections'
  );

  res.json(user.connections);
});

const removeConnection = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { userId } = req.params;

  await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
  await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

  res.json({ message: 'Connection removed successfully' });
});

const getConnectionStatus = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id;

  if (req.user.connections.includes(targetUserId)) {
    return res.json({ status: 'connected' });
  }

  const pendingRequest = await ConnectionRequest.findOne({
    $or: [
      { sender: currentUserId, recipient: targetUserId },
      { sender: targetUserId, recipient: currentUserId },
    ],
    status: 'pending',
  });

  if (pendingRequest) {
    if (pendingRequest.sender.toString() === currentUserId.toString()) {
      return res.json({ status: 'pending' });
    } else {
      return res.json({ status: 'received', requestId: pendingRequest._id });
    }
  }

  res.json({ status: 'not_connected' });
});

export {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
};
