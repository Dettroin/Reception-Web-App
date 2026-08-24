import Enquiry from '../models/Enquiry.js';
import { AppError } from '../middlewares/errorHandler.js';
import { createEnquirySchema } from '../utils/enquirySchema.js';

export const getEnquiries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      mobile,
      status,
      enquiryType,
      from,
      to,
      sortBy = '-createdAt',
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    if (mobile) query.mobile = mobile;
    if (status) query.status = status;
    if (enquiryType) query.enquiryType = enquiryType;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Enquiry.find(query).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
      Enquiry.countDocuments(query),
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

export const createEnquiry = async (req, res, next) => {
  try {
    const parsed = createEnquirySchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.errors[0].message, 400));
    const doc = await Enquiry.create(parsed.data);
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsed = createEnquirySchema.partial().safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.errors[0].message, 400));
    const doc = await Enquiry.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!doc) return next(new AppError('Enquiry not found', 404));
    res.json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Enquiry.findByIdAndDelete(id);
    if (!doc) return next(new AppError('Enquiry not found', 404));
    res.json({ success: true, data: { id } });
  } catch (e) {
    next(e);
  }
};