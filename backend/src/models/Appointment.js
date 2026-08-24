import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },
    meetingWith: { type: String, required: true, index: true },
    department: { type: String, index: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    purpose: String,
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
      index: true,
    },
    notes: String,
  },
  { timestamps: true }
);

appointmentSchema.index({ department: 1, status: 1, date: -1 });
appointmentSchema.index({ mobile: 1, date: -1 });

export default mongoose.model('Appointment', appointmentSchema);