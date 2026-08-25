import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    callerName: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },
    callType: {
      type: String,
      enum: ['Incoming', 'Outgoing', 'Missed'],
      required: true,
      index: true,
    },
    personOrDepartment: { type: String, index: true },
    purpose: String,
    dateTime: { type: Date, required: true, index: true },
    remarks: String,
  },
  { timestamps: true }
);

callLogSchema.index({ user: 1, mobile: 1, callType: 1, dateTime: -1 });
callLogSchema.index({ user: 1, personOrDepartment: 1, callType: 1 });

export default mongoose.model('CallLog', callLogSchema);