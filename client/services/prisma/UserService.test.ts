import type { User } from '@prisma/client';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { prisma } from '@/lib/prisma';
import { UserService } from './UserService';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user_clerk_123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  profileImageUrl: 'https://example.com/profile.jpg',
  lastSignInAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.resetAllMocks(); // Reset mocks before each test
  });

  // --- findUserById ---
  describe('findUserById', () => {
    it('should fetch a user by their ID (Clerk User ID)', async () => {
      const userId = 'user_clerk_123';
      const mockUser = createMockUser({ id: userId });
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

      const user = await userService.findUserById(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(user).toEqual(mockUser);
      expect(user?.id).toBe(userId);
    });

    it('should return null if the user is not found by ID', async () => {
      const userId = 'nonexistent_user_456';
      (prisma.user.findUnique as Mock).mockResolvedValue(null);

      const user = await userService.findUserById(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(user).toBeNull();
    });

    it('should log fetching attempt', async () => {
      const userId = 'user_logging_test_789';
      const consoleSpy = vi.spyOn(console, 'log');
      (prisma.user.findUnique as Mock).mockResolvedValue(null); // Doesn't matter what it returns for this test

      await userService.findUserById(userId);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Fetching user ${userId} via UserService`
      );
      consoleSpy.mockRestore(); // Restore original console.log
    });
  });
});
