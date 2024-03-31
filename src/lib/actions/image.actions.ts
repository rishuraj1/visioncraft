"use server";

import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { connectDB } from "../database/mongoose";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";
import { model } from "mongoose";

const populateUser = (query: any) => {
  return query.populate({
    path: "author",
    model: model("User"),
    select: "_id firstname lastname",
  });
};

// Add Image
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectDB();
    const author = await User.findOne({ _id: userId });
    if (!author) {
      throw new Error("User not found");
    }
    const newImage = await Image.create({
      ...image,
      author: author?._id,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

// Update Image
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectDB();

    const imageToUpdate = await Image.findById(image?._id);
    if (!imageToUpdate || imageToUpdate?.author.toHexString() !== userId)
      throw new Error("Unauthorized or Image not found");

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate?._id,
      image,
      { new: true },
    );
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

// Delete image
export async function deleteImage(imageId: string) {
  try {
    await connectDB();
    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// Get Image
export async function getImageById(imageId: string) {
  try {
    await connectDB();
    const image = await populateUser(Image.findById(imageId));

    if (!image) {
      throw new Error("Image not found");
    }

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}
