import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    num: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['SEATING', 'STORAGE', 'DINING', 'BEDROOM', 'WORKSPACE'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subtitle: String,
    tagline: String,
    dimensions: String,
    dimensionsMM: {
      w: Number,
      d: Number,
      h: Number,
    },
    defaultMaterial: String,
    defaultColor: String,
    defaultFinish: String,
    specs: [
      {
        label: String,
        value: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Furniture =
  mongoose.models.Furniture || mongoose.model('Furniture', furnitureSchema);
