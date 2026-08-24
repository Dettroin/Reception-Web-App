import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
  {
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

callLogSchema.index({ mobile: 1, callType: 1, dateTime: -1 });
callLogSchema.index({ personOrDepartment: 1, callType: 1 });

export default mongoose.model('CallLog', callLogSchema);