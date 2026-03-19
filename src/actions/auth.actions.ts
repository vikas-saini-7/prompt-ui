"use server";

import bcrypt from "bcrypt";
import connectDB from "@/lib/db/mongodb";
import { UserModel } from "@/lib/db/models";

export async function signupWithEmail(
  name: string,
  email: string,
  password: string,
) {
  // Validate input
  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create user - timestamps are auto-managed by Mongoose
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    });



    if (!newUser._id) {
      return { error: "Failed to create user" };
    }



    // Return success with email - client will handle signin and redirect
    return { success: true, email, password };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Signup error caught:", error);
    console.error("Error message:", errorMessage);
    console.error("Error stack:", errorStack);
    return { error: "Signup failed. Please try again." };
  }
}
