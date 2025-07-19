const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private/Admin
exports.createItem = async (req, res) => {
  try {
    const { title, description, startingPrice, imageUrl, endDate } = req.body;

    const item = await Item.create({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice, // Set current price to starting price initially
      imageUrl,
      endDate,
      seller: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private/Admin
exports.updateItem = async (req, res) => {
  try {
    const { title, description, startingPrice, imageUrl, endDate, status } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.startingPrice = startingPrice || item.startingPrice;
    item.imageUrl = imageUrl || item.imageUrl;
    item.endDate = endDate || item.endDate;
    item.status = status || item.status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private/Admin
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};