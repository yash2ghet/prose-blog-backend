import { eq } from "drizzle-orm";
import { db } from "../../../db/query.ts";
import { user } from "../../../db/schema/users.ts";
import { AppError } from "../../../lib/AppError.ts";
import type { UpdateProfileInput } from "./users.validation.ts";

export async function getUserProfile(userId: string) {
  const profile = (
    await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)
  )[0];

  if (!profile) {
    throw new AppError(404, "User not found");
  }

  return profile;
}

export async function updateUserProfile(userId: string, data: UpdateProfileInput) {
  const [updatedUser] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  return updatedUser;
}