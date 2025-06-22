import { auth } from "@clerk/nextjs/server";
import { describe, it, expect, vi, Mock } from "vitest";
import { ForbiddenError } from "../errors/prisma";
import { getUserIdFromAuth } from "./auth";

vi.mock("@clerk/nextjs/server", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@clerk/nextjs/server")>();
  return {
    ...mod,
    auth: vi.fn().mockResolvedValue({ userId: "user_test_123" }),
  };
});

describe("getUserIdFromAuth", () => {
  it("should return the user ID", async () => {
    const userId = await getUserIdFromAuth();
    expect(userId).toBe("user_test_123");
  });

  it("should throw ForbiddenError if user is not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      userId: null,
    } as any);

    await expect(getUserIdFromAuth()).rejects.toThrow(ForbiddenError);
  });
});
