import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['like', 'comment', 'connectionAccepted'],
    },

    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = model('Notification', notificationSchema);

export default Notification;
