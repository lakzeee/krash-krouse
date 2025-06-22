import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ForbiddenError, NotFoundError } from "../errors/prisma";

export function withRouteErrorHandling(handler: any): any {
  return async (req: NextRequest | Request, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      console.error("withRouteErrorHandling-error");
      console.error(error);
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            message: "Validation failed",
            details: error,
          },
          { status: 400 }
        );
      }
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2000":
            return NextResponse.json(
              {
                message: `Input value too long for field ${error.meta?.target}`,
                details: error,
              },
              { status: 400 }
            );
          case "P2002":
            return NextResponse.json(
              {
                message: `Unique constraint violation on ${Array.isArray(error.meta?.target) ? error.meta?.target.join(", ") : error.meta?.target}. This resource already exists.`,
                details: error,
              },
              { status: 409 }
            );
          case "P2003":
            return NextResponse.json(
              {
                message: `Foreign key constraint failed on field ${error.meta?.field_name}. The related record does not exist.`,
                details: error,
              },
              { status: 400 }
            );
          case "P2014":
            return NextResponse.json(
              {
                message: `The change you are trying to make would violate the required relation '${error.meta?.relation_name}' between the '${error.meta?.model_a_name}' and '${error.meta?.model_b_name}' models.`,
                details: error,
              },
              { status: 400 }
            );
          case "P2025":
            return NextResponse.json(
              {
                message:
                  error.meta?.cause || "The requested resource was not found.",
                details: error,
              },
              { status: 404 }
            );
          default:
            return NextResponse.json(
              {
                message: "A database unknown error occurred.",
                prismaErrorCode: error.code,
                details: error,
              },
              { status: 500 }
            );
        }
      }

      if (error instanceof PrismaClientValidationError) {
        return NextResponse.json(
          {
            message: "Database input validation failed.",
            details: error,
          },
          { status: 400 }
        );
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json(
          { message: `The requested resource was not found.`, details: error },
          { status: 404 }
        );
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          {
            message: `You are not authorized to access this resource.`,
            details: error,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { message: "An unexpected error occurred.", details: error },
        { status: 500 }
      );
    }
  };
}
