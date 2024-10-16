import mongoose from 'mongoose';

interface IImage {
    fileName: string;
    originalName: string;
}

interface IProduct {
    title: string;
    image: IImage;
    category: string;
    description: string;
    price: number
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
