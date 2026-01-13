const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Input = require('../models/Input');
const { calculateSavingsPercent } = require('../utils/calculateSaving');
const { logActivity } = require('../utils/logger');

const listGroups = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, state, lga, crop } = req.query;
    const q = {
      ...(status ? { status } : {}),
      ...(state ? { 'location.state': state } : {}),
      ...(lga ? { 'location.lga': lga } : {}),
      ...(crop ? { crop_focus: crop } : {})
    };

    const items = await Group.find(q)
      .populate('product_id', 'name category unit_type retail_price')
      .sort({ expires_at: 1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10))
      .lean();

    res.json({ items });
  } catch (err) {
    next(err);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const { name, product_id, max_members, target_price, expires_at, location, crop_focus } = req.body;
    if (!name || !product_id || !max_members || !target_price || !expires_at) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await Input.findById(product_id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const savings_percent = calculateSavingsPercent(product.retail_price, target_price);

    const group = await Group.create({
      name,
      product_id,
      max_members,
      current_members: 0,
      target_price,
      savings_percent,
      combined_order: 0,
      status: 'open',
      expires_at,
      location: location || req.user.location || {},
      crop_focus: crop_focus || null
    });

    res.status(201).json({ id: group._id });
  } catch (err) {
    next(err);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('product_id', 'name category unit_type retail_price')
      .lean();
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json(group);
  } catch (err) {
    next(err);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.updateStatus();
    if (group.status !== 'open') return res.status(400).json({ error: `Group is ${group.status}` });

    const exists = await GroupMember.findOne({ group_id: group._id, user_id: req.user._id }).lean();
    if (exists) return res.status(409).json({ error: 'Already a member' });

    await GroupMember.create({ group_id: group._id, user_id: req.user._id });

    group.current_members += 1;
    // For demo: assume 20 units per member for combined order calc
    group.combined_order = group.current_members * 20;
    group.updateStatus();
    await group.save();

    await logActivity(req.user._id, 'group_joined', `Joined ${group.name}`);
    res.json({ joined: true, status: group.status });
  } catch (err) {
    next(err);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { status, target_price, expires_at } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (status) group.status = status;
    if (target_price) group.target_price = target_price;
    if (expires_at) group.expires_at = expires_at;

    await group.save();
    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
};

// Simple chat stub (persist messages in ActivityLog or a dedicated Chat model if needed)
const postMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    await logActivity(req.user._id, 'group_chat', `Group ${id}: ${message}`);
    res.status(201).json({ posted: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { listGroups, createGroup, getGroup, joinGroup, updateGroup, postMessage };
