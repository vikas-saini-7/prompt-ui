"use server";

import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { User, userCollectionName } from "@/models/User";

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
    // Check if user already exists
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection(userCollectionName);

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    console.log("User does not exist, proceeding with signup for:", email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create user
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    console.log("User inserted with ID:", result.insertedId);

    if (!result.insertedId) {
      return { error: "Failed to create user" };
    }

    console.log("User account created successfully for:", email);

    // Return success with email - client will handle signin and redirect
    return { success: true, email, password };
  } catch (error: any) {
    console.error("Signup error caught:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return { error: "Signup failed. Please try again." };
  }
}
