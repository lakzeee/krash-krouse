import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class UserService {
  /**
   * Finds a user by their ID (Clerk User ID).
   * @param userId - The ID of the user to find.
   * @returns A promise resolving to the User object or null if not found.
   */
  async findUserById(userId: string): Promise<User | null> {
    console.log(`Fetching user ${userId} via UserService`);
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
