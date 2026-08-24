import Visitor from '../models/Visitor.js';
import Appointment from '../models/Appointment.js';
import Enquiry from '../models/Enquiry.js';
import CallLog from '../models/CallLog.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().slice(0, 10);
    const start = new Date(dateStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [
      totalVisitors,
      currentlyInside,
      todayAppointments,
      pendingEnquiries,
      todayCalls,
    ] = await Promise.all([
      Visitor.countDocuments({ entryTime: { $gte: start, $lt: end } }),
      Visitor.countDocuments({ entryTime: { $gte: start, $lt: end }, status: 'INSIDE' }),
      Appointment.countDocuments({ date: { $gte: start, $lt: end } }),
      Enquiry.countDocuments({ status: { $in: ['NEW', 'FOLLOW-UP'] } }),
      CallLog.countDocuments({ dateTime: { $gte: start, $lt: end } }),
    ]);

    const [visitorsList, enquiriesList, appointmentsList] = await Promise.all([
      Visitor.find({ entryTime: { $gte: start, $lt: end } }).sort('-entryTime').limit(5).lean(),
      Enquiry.find({ status: { $in: ['NEW', 'FOLLOW-UP'] } }).sort('-createdAt').limit(5).lean(),
      Appointment.find({ date: { $gte: start, $lt: end } }).sort('time').limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        date: dateStr,
        totalVisitors,
        currentlyInside,
        todayAppointments,
        pendingEnquiries,
        todayCalls,
        visitorsList,
        enquiriesList,
        appointmentsList,
      },
    });
  } catch (e) {
    next(e);
  }
};