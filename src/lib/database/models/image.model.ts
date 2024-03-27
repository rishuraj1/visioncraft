import { Document, model, models, Schema } from "mongoose";

export interface IImage extends Document {
  title: string;
  transformationType: string;
  publcId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema(
  {
    title: { type: String, required: true },
    transformationType: { type: String, required: true },
    publcId: { type: String, required: true },
    secureUrl: { type: URL, required: true },
    width: { type: Number },
    height: { type: Number },
    config: { type: Object },
    transformationUrl: { type: URL },
    aspectRatio: { type: String },
    color: { type: String },
    prompt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Image = models?.Image || model("Image", ImageSchema);
export default Image;
