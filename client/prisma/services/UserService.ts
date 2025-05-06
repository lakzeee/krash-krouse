import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

export class UserService {
  /**
   * Finds a user by their ID (Clerk User ID).
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user to find.
   * @returns A promise resolving to the User object or null if not found.
   */
  async findUserById(
    prisma: PrismaClient,
    userId: string
  ): Promise<User | null> {
    console.log(`Fetching user ${userId} via UserService`);
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

}
