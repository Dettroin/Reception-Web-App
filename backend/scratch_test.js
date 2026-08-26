import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/reception_db').then(async () => {
  const Visitor = mongoose.model('Visitor', new mongoose.Schema({}, { strict: false }));
  const year = 2026;
  const lastVisitor = await Visitor.findOne({ visitorId: { $regex: '^VIS-' + year + '-' } }).sort({ visitorId: -1 });
  console.log('lastVisitor:', lastVisitor);
  
  if (lastVisitor && lastVisitor.visitorId) {
      const parts = lastVisitor.visitorId.split('-');
      if (parts.length === 3) {
        console.log('Next seq:', parseInt(parts[2], 10) + 1);
      }
  }
  process.exit(0);
});
