import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    planId: {
      type: Number,
      required: true,
    },
    creditsBalance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const User = models?.User || model("User", UserSchema);

export default User;
