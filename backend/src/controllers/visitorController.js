import Visitor from '../models/Visitor.js';
import { AppError } from '../middlewares/errorHandler.js';
import { createVisitorSchema } from '../utils/visitorSchema.js';

export const getVisitors = async (req, res, next) => {
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
      sortBy = '-entryTime',
    } = req.query;

    const query = { user: req.user._id };
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { organization: { $regex: search, $options: 'i' } },
            { personToMeet: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }
    if (mobile) query.mobile = mobile;
    if (status) query.status = status;
    if (department) query.department = department;
    if (from || to) {
      query.entryTime = {};
      if (from) query.entryTime.$gte = new Date(from);
      if (to) query.entryTime.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Visitor.find(query).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
      Visitor.countDocuments(query),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    next(e);
  }
};

export const createVisitor = async (req, res, next) => {
  try {
    const parsed = createVisitorSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }
    const body = parsed.data;

    const count = await Visitor.countDocuments({ user: req.user._id });
    const year = new Date().getFullYear();
    const seq = String(count + 1).padStart(5, '0');
    const visitorId = `VIS-${year}-${seq}`;

    const doc = await Visitor.create({
      ...body,
      user: req.user._id,
      visitorId,
      entryTime: body.entryTime ? new Date(body.entryTime) : new Date(),
      status: 'INSIDE',
    });

    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const getVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Visitor.findOne({ _id: id, user: req.user._id }).lean();
    if (!doc) return next(new AppError('Visitor not found', 404));
    res.json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const updateVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsed = createVisitorSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }
    const doc = await Visitor.findOneAndUpdate({ _id: id, user: req.user._id }, parsed.data, { new: true, runValidators: true });
    if (!doc) return next(new AppError('Visitor not found', 404));
    res.json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const checkoutVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Visitor.findOne({ _id: id, user: req.user._id });
    if (!doc) return next(new AppError('Visitor not found', 404));
    if (doc.status !== 'INSIDE') {
      return next(new AppError('Visitor is not currently inside', 400));
    }
    doc.exitTime = new Date();
    doc.status = 'COMPLETED';
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

export const deleteVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Visitor.findOneAndDelete({ _id: id, user: req.user._id });
    if (!doc) return next(new AppError('Visitor not found', 404));
    res.json({ success: true, data: { id } });
  } catch (e) {
    next(e);
  }
};