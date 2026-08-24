import Appointment from '../models/Appointment.js';
import { AppError } from '../middlewares/errorHandler.js';
import { createAppointmentSchema } from '../utils/appointmentSchema.js';

export const getAppointments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      mobile,
      status,
      department,
      from,
      to,
      sortBy = '-date',
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { meetingWith: { $regex: search, $options: 'i' } },
      ];
    }
    if (mobile) query.mobile = mobile;
    if (status) query.status = status;
    if (department) query.department = department;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Appointment.find(query).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
      Appointment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (e) {
    next(e);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.errors[0].message, 400));
    const doc = await Appointment.create(parsed.data);
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsed = createAppointmentSchema.partial().safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.errors[0].message, 400));
    const doc = await Appointment.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!doc) return next(new AppError('Appointment not found', 404));
    res.json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Appointment.findByIdAndDelete(id);
    if (!doc) return next(new AppError('Appointment not found', 404));
    res.json({ success: true, data: { id } });
  } catch (e) {
    next(e);
  }
};