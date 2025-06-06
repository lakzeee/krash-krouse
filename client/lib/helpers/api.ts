import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function withRouteErrorHandling(handler: any): any {
  return async (req: NextRequest | Request, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: 'Validation failed', errors: error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2000':
            return NextResponse.json(
              {
                message: `Input value too long for field ${error.meta?.target}`,
              },
              { status: 400 }
            );
          case 'P2002':
            return NextResponse.json(
              {
                message: `Unique constraint violation on ${Array.isArray(error.meta?.target) ? error.meta?.target.join(', ') : error.meta?.target}. This resource already exists.`,
              },
              { status: 409 }
            );
          case 'P2003':
            return NextResponse.json(
              {
                message: `Foreign key constraint failed on field ${error.meta?.field_name}. The related record does not exist.`,
              },
              { status: 400 }
            );
          case 'P2014':
            return NextResponse.json(
              {
                message: `The change you are trying to make would violate the required relation '${error.meta?.relation_name}' between the '${error.meta?.model_a_name}' and '${error.meta?.model_b_name}' models.`,
              },
              { status: 400 }
            );
          case 'P2025':
            return NextResponse.json(
              {
                message:
                  error.meta?.cause || 'The requested resource was not found.',
              },
              { status: 404 }
            );
          default:
            return NextResponse.json(
              {
                message: 'A database error occurred.',
                prismaErrorCode: error.code,
              },
              { status: 500 }
            );
        }
      }
      if (error instanceof PrismaClientValidationError) {
        return NextResponse.json(
          {
            message: 'Database input validation failed.',
            details: error.message.split('\n'),
          },
          { status: 400 }
        );
      }
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  };
}
