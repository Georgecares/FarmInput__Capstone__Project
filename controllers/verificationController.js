const VerificationDocument = require('../models/VerificationDocument');
const User = require('../models/User');
const Notification = require('../models/Notification');

const uploadDocument = async (req, res, next) => {
  try {
    const { doc_type, file_url, notes } = req.body;
    if (!doc_type || !file_url) return res.status(400).json({ error: 'doc_type and file_url required' });

    const doc = await VerificationDocument.create({
      user_id: req.user._id,
      doc_type,
      file_url,
      notes
    });

    res.status(201).json({ id: doc._id, status: doc.status });
  } catch (err) {
    next(err);
  }
};

const listDocuments = async (req, res, next) => {
  try {
    const docs = await VerificationDocument.find({ user_id: req.user._id }).lean();
    res.json({ docs });
  } catch (err) {
    next(err);
  }
};

const reviewDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const doc = await VerificationDocument.findById(id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.status = status;
    doc.reviewed_by = req.user._id;
    doc.notes = notes;
    await doc.save();

    if (status === 'approved') {
      await User.findByIdAndUpdate(doc.user_id, { $set: { verified: true } });
      await Notification.create({
        user_id: doc.user_id,
        message: 'Verification approved',
        type: 'verification'
      });
    } else {
      await Notification.create({
        user_id: doc.user_id,
        message: 'Verification rejected',
        type: 'verification'
      });
    }

    res.json({ reviewed: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadDocument, listDocuments, reviewDocument };
