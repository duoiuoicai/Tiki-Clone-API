const mongoose = require('mongoose');
const slugify = require('slugify');

// SCHEMA SETUP
const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Shop name cannot be longer than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be longer than 500 characters']
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number cannot be longer than 20 characters']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create shop slug from the name before save
ShopSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

// Cascade delete products when a shop is deleted
ShopSchema.pre('remove', async function(next) {
  console.log(`Products is being removed from shop ${this._id}`);
  await this.model('Product').deleteMany({ shop: this._id });
  next();
});

// Reverse populate with virtuals
ShopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shop',
  justOne: false
});

module.exports = mongoose.model('Shop', ShopSchema);
