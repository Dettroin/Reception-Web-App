import CallLog from '../models/CallLog.js';
import { createCallLogSchema } from '../utils/callLogSchema.js';

// CREATE Call Log
export const createCallLog = async (req, res, next) => {
  try {
    const parsed = createCallLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation Error',
      });
    }

    const { dateTime, purpose, remarks, ...rest } = parsed.data;

    const newLog = await CallLog.create({
      ...rest,
      purpose: purpose || remarks || '',
      remarks: remarks || purpose || '',
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: newLog,
    });
  } catch (error) {
    next(error);
  }
};

// GET All Call Logs
export const getCallLogs = async (req, res, next) => {
  try {
    const logs = await CallLog.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Call Log
export const deleteCallLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLog = await CallLog.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedLog) {
      return res.status(404).json({ success: false, message: 'Call log not found' });
    }

    res.status(200).json({ success: true, message: 'Call log deleted successfully' });
  } catch (error) {
    next(error);
  }
};