import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },
    email: String,
    organization: String,
    purpose: String,
    personToMeet: { type: String, index: true },
    department: { type: String, index: true },
    entryTime: { type: Date, required: true, index: true },
    exitTime: Date,
    idProofType: String,
    idProofNumber: String,
    remarks: String,
    status: {
      type: String,
      enum: ['INSIDE', 'COMPLETED', 'CANCELLED'],
      default: 'INSIDE',
      index: true,
    },
    visitorId: { type: String, unique: true },
  },
  { timestamps: true }
);

visitorSchema.index({ user: 1, department: 1, status: 1, entryTime: -1 });
visitorSchema.index({ user: 1, mobile: 1, entryTime: -1 });

export default mongoose.model('Visitor', visitorSchema);