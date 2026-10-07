import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    product: {
      type: String,
      required: [true, 'Product specification is required'],
    },
    material: {
      type: String,
      default: 'Natural Wood',
    },
    color: {
      type: String,
      default: 'Warm Ivory',
    },
    finish: {
      type: String,
      default: 'Matte',
    },
    customRequirement: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'in_review', 'spec_sent', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry =
  mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
