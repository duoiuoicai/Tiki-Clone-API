const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
const getShops = asyncHandler(async (req, res, next) => {
  const shops = await Shop.find();
  res.status(200).json({
    success: true,
    total: shops.length,
    data: shops
  });
});

// @desc    Get single shop
// @route   GET /api/v1/shops/:id
// @access  Public
const getShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    return next(
      new ErrorResponse(`Shop not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shop
  });
});

// @desc    Create new shop
// @route   POST /api/v1/shops
// @access  Private
const createShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.create(req.body);

  res.status(201).json({
    success: true,
    data: shop
  });
});

// @desc    Update shop
// @route   PUT /api/v1/shops/:id
// @access  Private
const updateShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!shop) {
    return next(
      new ErrorResponse(`Shop not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shop
  });
});

// @desc    Update shop
// @route   DELETE /api/v1/shops/:id
// @access  Private
const deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndDelete(req.params.id);

  if (!shop) {
    next(new ErrorResponse(`Shop not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = { getShops, getShop, createShop, updateShop, deleteShop };
