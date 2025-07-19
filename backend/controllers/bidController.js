const Bid = require('../models/Bid');
const Item = require('../models/Item');

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private
exports.createBid = async (req, res) => {
  try {
    const { itemId, amount } = req.body;

    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if item is still active
    if (item.status !== 'active') {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid amount is higher than current price
    if (amount <= item.currentPrice) {
      return res.status(400).json({ message: 'Bid must be higher than current price' });
    }

    // Create bid
    const bid = await Bid.create({
      item: itemId,
      bidder: req.user._id,
      amount,
    });

    // Update item's current price
    item.currentPrice = amount;
    await item.save();

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bids for an item
// @route   GET /api/bids/:itemId
// @access  Public
exports.getBidsByItem = async (req, res) => {
  try {
    const bids = await Bid.find({ item: req.params.itemId })
      .sort({ amount: -1 })
      .populate('bidder', 'username');
    
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/user
// @access  Private
exports.getUserBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .sort({ timestamp: -1 })
      .populate('item', 'title currentPrice endDate status');
    
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};