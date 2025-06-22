import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { ZodError, ZodIssueCode } from "zod";
import { NotFoundError, ForbiddenError } from "../errors/prisma";
import { withRouteErrorHandling } from "./api";

vi.mock("next/server", async (importOriginal) => {
  const original = await importOriginal<typeof import("next/server")>();
  return {
    ...original,
    NextResponse: {
      json: vi.fn().mockImplementation((body, init) => ({
        // Simple mock for NextResponse.json
        json: async () => body, // To allow checking the body
        status: init?.status,
        headers: new Headers(init?.headers),
        ok: init?.status ? init.status >= 200 && init.status < 300 : true,
        redirected: false,
        type: "basic",
        url: "",
        clone: vi.fn(),
        text: async () => JSON.stringify(body),
        blob: async () => new Blob([JSON.stringify(body)]),
        formData: async () => new FormData(),
        arrayBuffer: async () => new ArrayBuffer(0),
      })),
    },
  };
});

// Mock custom errors (assuming they are simple Error extensions)
vi.mock("../errors/prisma", async (importOriginal) => {
  const original = await importOriginal<typeof import("../errors/prisma")>();
  return {
    ...original,
    NotFoundError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
      }
    },
    ForbiddenError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
      }
    },
  };
});

describe("withRouteErrorHandling", () => {
  let mockHandler: Mock;
  let wrappedHandler: (
    req: NextRequest | Request,
    context: any
  ) => Promise<any>;
  const mockRequest = {} as NextRequest; // Simple mock, extend if needed
  const mockContext = {}; // Simple mock

  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
    mockHandler = vi.fn();
    wrappedHandler = withRouteErrorHandling(mockHandler);
  });

  it("should call the handler and return its result if no error occurs", async () => {
    const expectedResult = { data: "success" };
    mockHandler.mockResolvedValue(expectedResult);

    const result = await wrappedHandler(mockRequest, mockContext);

    expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockContext);
    expect(result).toEqual(expectedResult);
    expect(NextResponse.json).not.toHaveBeenCalled();
  });

  it("should handle ZodError and return 400", async () => {
    const zodError = new ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: "string",
        received: "number",
        path: ["name"],
        message: "Expected string, received number",
      },
    ]);
    mockHandler.mockRejectedValue(zodError);

    await wrappedHandler(mockRequest, mockContext);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        details: zodError,
      },
      { status: 400 }
    );
  });

  // --- PrismaClientKnownRequestError Tests ---
  const prismaKnownErrorTestCases = [
    {
      code: "P2000",
      meta: { target: "fieldName" },
      expectedStatus: 400,
      expectedMessage: "Input value too long for field fieldName",
    },
    {
      code: "P2002",
      meta: { target: ["email"] },
      expectedStatus: 409,
      expectedMessage:
        "Unique constraint violation on email. This resource already exists.",
    },
    {
      code: "P2002", // Test with target as string
      meta: { target: "username" },
      expectedStatus: 409,
      expectedMessage:
        "Unique constraint violation on username. This resource already exists.",
    },
    {
      code: "P2003",
      meta: { field_name: "authorId" },
      expectedStatus: 400,
      expectedMessage:
        "Foreign key constraint failed on field authorId. The related record does not exist.",
    },
    {
      code: "P2014",
      meta: {
        relation_name: "PostToUser",
        model_a_name: "Post",
        model_b_name: "User",
      },
      expectedStatus: 400,
      expectedMessage:
        "The change you are trying to make would violate the required relation 'PostToUser' between the 'Post' and 'User' models.",
    },
    {
      code: "P2025",
      meta: { cause: "Record to delete does not exist." },
      expectedStatus: 404,
      expectedMessage: "Record to delete does not exist.",
    },
    {
      code: "P2025", // Test without specific cause
      meta: {},
      expectedStatus: 404,
      expectedMessage: "The requested resource was not found.",
    },
    {
      code: "PXXXX", // Unknown Prisma code
      meta: {},
      expectedStatus: 500,
      expectedMessage: "A database unknown error occurred.",
      prismaErrorCode: "PXXXX",
    },
  ];

  prismaKnownErrorTestCases.forEach(
    ({ code, meta, expectedStatus, expectedMessage, prismaErrorCode }) => {
      it(`should handle PrismaClientKnownRequestError ${code} and return ${expectedStatus}`, async () => {
        const error = new PrismaClientKnownRequestError("message", {
          code,
          clientVersion: "x.y.z",
          meta,
        });
        mockHandler.mockRejectedValue(error);

        await wrappedHandler(mockRequest, mockContext);

        const expectedBody: any = {
          message: expectedMessage,
          details: error,
        };
        if (prismaErrorCode) {
          expectedBody.prismaErrorCode = prismaErrorCode;
        }

        expect(NextResponse.json).toHaveBeenCalledWith(expectedBody, {
          status: expectedStatus,
        });
      });
    }
  );

  it("should handle PrismaClientValidationError and return 400", async () => {
    const error = new PrismaClientValidationError("Validation failed", {
      clientVersion: "x.y.z",
    });
    mockHandler.mockRejectedValue(error);

    await wrappedHandler(mockRequest, mockContext);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Database input validation failed.",
        details: error,
      },
      { status: 400 }
    );
  });

  it("should handle custom NotFoundError and return 404", async () => {
    const error = new NotFoundError("Resource not found here");
    mockHandler.mockRejectedValue(error);

    await wrappedHandler(mockRequest, mockContext);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "The requested resource was not found.", details: error },
      { status: 404 }
    );
  });

  it("should handle custom ForbiddenError and return 403", async () => {
    const error = new ForbiddenError("User is not allowed");
    mockHandler.mockRejectedValue(error);

    await wrappedHandler(mockRequest, mockContext);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "You are not authorized to access this resource.",
        details: error,
      },
      { status: 403 }
    );
  });

  it("should handle an unexpected error and return 500", async () => {
    const error = new Error("Something went very wrong");
    mockHandler.mockRejectedValue(error);

    await wrappedHandler(mockRequest, mockContext);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "An unexpected error occurred.", details: error },
      { status: 500 }
    );
  });
});
