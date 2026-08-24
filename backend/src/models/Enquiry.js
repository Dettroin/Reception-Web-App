import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
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

enquirySchema.index({ mobile: 1, status: 1, followUpDate: 1 });
enquirySchema.index({ enquiryType: 1, status: 1 });

export default mongoose.model('Enquiry', enquirySchema);