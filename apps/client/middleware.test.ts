import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

// Declare mockCreateRouteMatcherImplementation at the very top as it's used in a vi.mock factory
const mockCreateRouteMatcherImplementation = vi.fn();

// Import NextRequest, NextFetchEvent, and NextResponse directly

// --- Mocking External Dependencies ---

const mockAuthProtect = vi.fn();
// This is our simulated AuthObject. If your middleware's callback uses other properties from AuthObject (e.g., auth.userId),
// you'll need to add them to this mockAuth object.
const mockAuth = {
  protect: mockAuthProtect,
  userId: 'test_user_id_123', // Example userId
  isPublicRoute: false, // Example, can be overridden by createRouteMatcher mocks
  isApiRoute: false, // Example
  debug: vi.fn(),
  has: vi.fn().mockResolvedValue(false), // Example for permission checks
  // Add other properties/methods from Clerk's AuthObject as needed by your middleware
};

vi.mock('@clerk/nextjs/server', async () => {
  // This plain function will act as the HOC mock for clerkMiddleware.
  // It's not a vi.fn() itself, so its definition won't be reset by vi.resetAllMocks().
  const clerkMiddlewareMock = (
    callbackFromMiddlewareFile: (auth: any, req: NextRequest) => any
  ) => {
    // This is the function that the HOC returns (the actual middleware function).
    return async (request: NextRequest, event?: NextFetchEvent) => {
      // The callbackFromMiddlewareFile (from your actual middleware.ts) expects (auth, req).
      // We provide our mockAuth here, and the incoming request.
      return callbackFromMiddlewareFile(mockAuth, request);
    };
  };

  return {
    createRouteMatcher: mockCreateRouteMatcherImplementation, // This is a vi.fn() and is fine.
    clerkMiddleware: clerkMiddlewareMock, // Use the plain function as the mock.
  };
});

vi.mock('next/server', async () => {
  const actualNextServer =
    await vi.importActual<typeof import('next/server')>('next/server');
  return {
    // Preserve other exports from next/server, including NextRequest constructor
    ...actualNextServer,
    NextResponse: {
      // Mock only the parts of NextResponse we interact with
      ...actualNextServer.NextResponse, // Spread original NextResponse static properties/methods
      redirect: vi.fn(), // Mock redirect inline here. This vi.fn() will be reset by resetAllMocks.
    },
  };
});

// Helper to create a mock NextRequest
const createMockRequest = (urlPath: string, headers = {}): NextRequest => {
  const url = `http://localhost:3000${urlPath}`;
  // Use the actual NextRequest constructor, available because vi.mock('next/server') spreads actualNextServer
  return new NextRequest(url, { headers });
};

// Helper to create a mock NextFetchEvent
const createMockFetchEvent = (): NextFetchEvent => {
  // NextFetchEvent is an interface, so we need to mock its methods.
  return {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
    // Cast to unknown first, then to NextFetchEvent for simplicity if dealing with complex interface parts
  } as unknown as NextFetchEvent;
};

describe('Clerk Middleware', () => {
  let originalVercelEnv: string | undefined;
  let mockEvent: NextFetchEvent;

  beforeEach(() => {
    vi.resetAllMocks(); // Reset all mocks including call counts etc.
    // NextResponse.redirect is a vi.fn() due to the mock above, so resetAllMocks handles it.
    originalVercelEnv = process.env.VERCEL_ENV;
    mockEvent = createMockFetchEvent(); // Create a new mock event for each test
  });

  afterEach(() => {
    process.env.VERCEL_ENV = originalVercelEnv; // Restore original env variable
    vi.resetModules(); // Clean up modules after each test
  });

  // --- Test Scenarios ---

  describe('Production Environment (VERCEL_ENV = "production")', () => {
    beforeEach(() => {
      process.env.VERCEL_ENV = 'production';
    });

    it('should redirect a dev route ("/api-docs") to "/" and NOT call auth.protect', async () => {
      const req = createMockRequest('/api-docs');

      const mockIsPublic = vi.fn().mockReturnValue(false); // /api-docs is not public
      const mockIsDev = vi.fn().mockReturnValue(true); // /api-docs is a dev route

      // Configure the mockCreateRouteMatcherImplementation (which is now defined at the top)
      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(NextResponse.redirect as Mock).toHaveBeenCalledTimes(1);
      expect(NextResponse.redirect as Mock).toHaveBeenCalledWith(
        new URL('/', req.url)
      );
      expect(mockAuth.protect).not.toHaveBeenCalled();
    });

    it('should call auth.protect() for a non-public, non-dev route', async () => {
      const req = createMockRequest('/dashboard');

      const mockIsPublic = vi.fn().mockReturnValue(false);
      const mockIsDev = vi.fn().mockReturnValue(false);

      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(mockIsPublic).toHaveBeenCalledWith(req);
      expect(mockAuth.protect).toHaveBeenCalledTimes(1);
      expect(NextResponse.redirect as Mock).not.toHaveBeenCalled();
    });

    it('should NOT call auth.protect() NOR redirect for a public route', async () => {
      const req = createMockRequest('/'); // Example public route

      const mockIsPublic = vi.fn().mockReturnValue(true); // Route is public
      const mockIsDev = vi.fn().mockReturnValue(false); // Route is not a dev route

      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(mockIsPublic).toHaveBeenCalledWith(req);
      expect(mockAuth.protect).not.toHaveBeenCalled();
      expect(NextResponse.redirect as Mock).not.toHaveBeenCalled();
    });
  }); // End of Production Environment describe block

  // --- Development Environment Tests ---
  describe('Development Environment (VERCEL_ENV != "production")', () => {
    beforeEach(() => {
      process.env.VERCEL_ENV = 'development';
    });

    it('should NOT redirect a dev route ("/api-docs") and call auth.protect() because it is not public', async () => {
      const req = createMockRequest('/api-docs');

      const mockIsPublic = vi.fn().mockReturnValue(false); // /api-docs is not public
      const mockIsDev = vi.fn().mockReturnValue(true); // /api-docs is a dev route

      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(mockIsPublic).toHaveBeenCalledWith(req);
      expect(NextResponse.redirect as Mock).not.toHaveBeenCalled();
      expect(mockAuth.protect).toHaveBeenCalledTimes(1);
    });

    it('should call auth.protect() for a non-public, non-dev route', async () => {
      const req = createMockRequest('/dashboard');

      const mockIsPublic = vi.fn().mockReturnValue(false);
      const mockIsDev = vi.fn().mockReturnValue(false);

      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(mockIsPublic).toHaveBeenCalledWith(req);
      expect(mockAuth.protect).toHaveBeenCalledTimes(1);
      expect(NextResponse.redirect as Mock).not.toHaveBeenCalled();
    });

    it('should NOT call auth.protect() NOR redirect for a public route', async () => {
      const req = createMockRequest('/sign-in'); // Example public route

      const mockIsPublic = vi.fn().mockReturnValue(true); // Route is public
      const mockIsDev = vi.fn().mockReturnValue(false); // Route is not a dev route

      mockCreateRouteMatcherImplementation
        .mockImplementationOnce(() => mockIsPublic)
        .mockImplementationOnce(() => mockIsDev);

      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const currentMiddleware = middlewareModule.default;

      expect(typeof currentMiddleware).toBe('function'); // Add this check
      await currentMiddleware(req, mockEvent);

      expect(mockIsDev).toHaveBeenCalledWith(req);
      expect(mockIsPublic).toHaveBeenCalledWith(req);
      expect(mockAuth.protect).not.toHaveBeenCalled();
      expect(NextResponse.redirect as Mock).not.toHaveBeenCalled();
    });
  }); // End of Development Environment describe block

  // --- Middleware Config Test ---
  describe('Middleware Config', () => {
    it('should export the correct matcher config', async () => {
      vi.resetModules();
      const middlewareModule = await import('./middleware'); // Ensure this path is correct
      const middlewareConfig = middlewareModule.config;

      expect(middlewareConfig.matcher).toEqual([
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
      ]);
    });
  }); // End of Middleware Config describe block
}); // End of main describe block
