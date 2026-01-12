const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");

// @desc    Create a new buying group (Epic 5)
// @route   POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const {
      inputCategory,
      targetInput,
      targetQuantity,
      deadline,
      location,
      myContribution, // How much the creator is buying
    } = req.body;

    // 1. Create the Group
    const group = await Group.create({
      creator: req.user.id,
      inputCategory,
      targetInput,
      targetQuantity,
      currentQuantity: myContribution || 0,
      deadline,
      location,
    });

    // 2. Add creator as the first member
    await GroupMember.create({
      group: group._id,
      farmer: req.user.id,
      contributionQuantity: myContribution || 0,
      isVerified: true, // Creator is verified by default for this group
    });

    res.status(201).json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all groups (with optional location filtering)
// @route   GET /api/groups
exports.getGroups = async (req, res) => {
  try {
    const { state, lga } = req.query;
    let query = { status: "open" };

    if (state) query["location.state"] = state;
    if (lga) query["location.lga"] = lga;

    const groups = await Group.find(query).populate("creator", "name");
    res.status(200).json({ success: true, count: groups.length, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Join a group (Epic 5)
// @route   POST /api/groups/:id/join
exports.joinGroup = async (req, res) => {
  try {
    const { contributionQuantity } = req.body;
    
    if (!contributionQuantity) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide contribution quantity",
        });
    }

    const group = await Group.findById(req.params.id);
    if (!group)
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });

    // Create the member record
    await GroupMember.create({
      group: group._id,
      farmer: req.user.id,
      contributionQuantity,
    });
    // Update the group's current quantity
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentQuantity: contributionQuantity } },
      { new: true } // returns the updated document
    );

    // Auto-lock if target reached
    if (updatedGroup.currentQuantity >= updatedGroup.targetQuantity) {
      updatedGroup.status = "locked";
      await updatedGroup.save();
    }

    res.status(200).json({ success: true, data: updatedGroup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};