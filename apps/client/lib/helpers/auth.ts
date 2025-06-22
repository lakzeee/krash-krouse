import { auth } from "@clerk/nextjs/server";
import { ForbiddenError } from "../errors/prisma";

export async function getUserIdFromAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new ForbiddenError("User not found");
  }
  return userId;
}
