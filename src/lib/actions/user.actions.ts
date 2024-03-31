"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectDB } from "../database/mongoose";
import { handleError } from "../utils";

// Create a new user
export async function createUser(user: CreateUserParams) {
  try {
    await connectDB();
    const newUser = await User.create(user);
    console.log("User", newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// Get a user by their ID
export async function getUserById(userId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// Update a user's information
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectDB();

    const existingUser = await User.findOne({ clerkId });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// Delete a user
export async function deleteUser(clerkId: string) {
  try {
    await connectDB();
    const existingUser = await User.findOne({ clerkId });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findOneAndDelete(existingUser?._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// Use credits
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectDB();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { credits: creditFee } },
      { new: true },
    );

    if (!updatedUserCredits) {
      throw new Error("User credits update failed");
    }

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
