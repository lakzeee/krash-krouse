import { GraphQLError } from 'graphql/error';

// Custom Error Classes
export class AuthenticationError extends GraphQLError {
  constructor(message = 'Not authenticated') {
    super(message, { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message = 'Resource not found') {
    super(message, { extensions: { code: 'NOT_FOUND' } });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message = 'Permission denied') {
    super(message, { extensions: { code: 'FORBIDDEN' } });
  }
}
