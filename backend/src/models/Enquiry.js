import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },
    email: String,
    enquiryType: { type: String, index: true },
    message: { type: String, required: true },
    assignedTo: String,
    followUpDate: { type: Date, index: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'FOLLOW-UP', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    remarks: String,
  },
  { timestamps: true }
);

enquirySchema.index({ user: 1, mobile: 1, status: 1, followUpDate: 1 });
enquirySchema.index({ user: 1, enquiryType: 1, status: 1 });

export default mongoose.model('Enquiry', enquirySchema);