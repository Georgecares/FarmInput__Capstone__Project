const Supplier = require("../models/Supplier");

// @desc    Get all verified suppliers (Epic 7 - User Story 1)
// @route   GET /api/suppliers
// @access  Protected
exports.getSuppliers = async (req, res) => {
  try {
    const { state, lga, category } = req.query;

    // Base query: Only show verified suppliers to build trust (Epic 9)
    let query = { verificationStatus: "verified" };

    // Apply filters based on farmer's location or interest
    if (state) query["location.state"] = state;
    if (lga) query["location.lga"] = lga;
    if (category) query["inventory.category"] = category;

    const suppliers = await Supplier.find(query).select("-user");

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single supplier details & full catalog
// @route   GET /api/suppliers/:id
// @access  Protected
exports.getSupplierDetails = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    res.status(200).json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register as a supplier (Epic 7 - User Story 4)
// @route   POST /api/suppliers
// @access  Protected (Should be restricted to 'supplier' roles in a full system)
exports.registerSupplier = async (req, res) => {
  try {
    // Check if user is already a supplier
    const existingSupplier = await Supplier.findOne({ user: req.user.id });
    if (existingSupplier) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User is already registered as a supplier",
        });
    }

    const supplier = await Supplier.create({
      ...req.body,
      user: req.user.id,
      verificationStatus: "pending", // Requires admin review (Epic 9)
    });

    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add or Update product in inventory (Epic 7 - User Story 4 & 5)
// @route   PATCH /api/suppliers/inventory
// @access  Protected (Supplier Only)
exports.updateInventory = async (req, res) => {
  try {
    const { itemName, category, retailPrice, bulkPrice, minBulkQuantity } =
      req.body;

    const supplier = await Supplier.findOne({ user: req.user.id });
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier profile not found" });
    }

    // Check if item already exists to update it, otherwise push new item
    const itemIndex = supplier.inventory.findIndex(
      (item) => item.itemName === itemName
    );

    if (itemIndex > -1) {
      supplier.inventory[itemIndex] = {
        itemName,
        category,
        retailPrice,
        bulkPrice,
        minBulkQuantity,
      };
    } else {
      supplier.inventory.push({
        itemName,
        category,
        retailPrice,
        bulkPrice,
        minBulkQuantity,
      });
    }

    await supplier.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Inventory updated",
        data: supplier.inventory,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
