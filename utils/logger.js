const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user_id, action_type, description) => {
  try {
    await ActivityLog.create({ user_id, action_type, description });
  } catch (e) {
    console.error('ActivityLog error:', e.message);
  }
};

module.exports = { logActivity };
