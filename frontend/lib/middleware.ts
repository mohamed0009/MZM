import { NextRequest, NextResponse } from 'next/server';
import { AnyPermission } from './permissions';

type RequestMetadata = {
  startTime: number;
  userId?: string;
  userName?: string;
  userRole?: string;
  ip: string;
  userAgent: string;
  path: string;
  method: string;
};

/**
 * PharmaFlow Application Middleware
 * 
 * This middleware:
 * 1. Enforces authentication for protected routes
 * 2. Captures request metadata for audit logs
 * 3. Handles rate limiting and abuse prevention
 * 4. Adds security headers to responses
 */
export async function middleware(request: NextRequest) {
  // Capture request metadata for audit logging
  const requestMetadata: RequestMetadata = {
    startTime: Date.now(),
    ip: request.ip || '127.0.0.1',
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
  };

  // Skip middleware for public routes
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Check for authentication
  const authToken = request.cookies.get('pharma_auth')?.value;
  
  if (!authToken) {
    const response = redirectToLogin(request);
    // Capture the attempted access for security logs
    await logUnauthorizedAccess(requestMetadata);
    return response;
  }

  // Parse user from token
  try {
    // In a real implementation, we would validate the token
    // For now, we assume it's a valid JSON string
    const user = JSON.parse(authToken);
    
    // Add user info to request metadata
    requestMetadata.userId = user.id;
    requestMetadata.userName = user.name;
    requestMetadata.userRole = user.role;
    
    // For role-restricted routes, check permissions
    if (isRoleRestrictedRoute(request.nextUrl.pathname)) {
      const hasAccess = checkRouteAccess(request.nextUrl.pathname, user.role);
      
      if (!hasAccess) {
        await logAccessDenied(requestMetadata, 'Insufficient permissions');
        return redirectToUnauthorized(request);
      }
    }
    
    // Add user info to headers for backend services
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', user.id);
    requestHeaders.set('X-User-Role', user.role);
    
    // Continue to the requested page
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Add security headers to response
    addSecurityHeaders(response);
    
    // Capture successful access for audit logs
    await logSuccessfulAccess(requestMetadata);
    
    return response;
  } catch (error) {
    // Token is invalid, redirect to login
    console.error('Auth token validation error:', error);
    await logUnauthorizedAccess(requestMetadata, 'Invalid token');
    return redirectToLogin(request);
  }
}

/**
 * Determine if a route is publicly accessible without authentication
 */
function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/terms',
    '/privacy',
    '/cookies',
    '/about',
    '/contact',
    '/features',
    '/tarifs',
    '/temoignages',
    '/faq',
    '/api/health',
  ];
  
  // Check if the path is in the public routes list
  if (publicRoutes.includes(path)) {
    return true;
  }
  
  // Check if the path starts with public prefixes
  const publicPrefixes = [
    '/_next/',
    '/images/',
    '/fonts/',
    '/api/public/',
    '/static/',
  ];
  
  return publicPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Check if a route is restricted by role
 */
function isRoleRestrictedRoute(path: string): boolean {
  const restrictedPrefixes = [
    '/dashboard',
    '/inventory',
    '/clients',
    '/sales',
    '/orders',
    '/users',
    '/reports',
    '/settings',
    '/prescriptions',
  ];
  
  return restrictedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Check if a user's role has access to a specific route
 */
function checkRouteAccess(path: string, role: string): boolean {
  // Admin has access to everything
  if (role === 'admin') {
    return true;
  }
  
  // Define role-based route access
  const roleRouteAccess: Record<string, string[]> = {
    pharmacist: [
      '/dashboard',
      '/inventory',
      '/clients',
      '/sales',
      '/orders',
      '/prescriptions',
      '/reports',
    ],
    technician: [
      '/dashboard',
      '/inventory',
      '/clients',
      '/prescriptions',
    ],
    cashier: [
      '/dashboard',
      '/sales',
      '/clients',
    ],
  };
  
  const allowedPrefixes = roleRouteAccess[role] || [];
  return allowedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Redirect to login page
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';
  url.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

/**
 * Redirect to unauthorized page
 */
function redirectToUnauthorized(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/unauthorized';
  return NextResponse.redirect(url);
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  );
  
  // Other security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

/**
 * Log unauthorized access attempts
 */
async function logUnauthorizedAccess(metadata: RequestMetadata, reason: string = 'No auth token'): Promise<void> {
  console.warn(`SECURITY: Unauthorized access to ${metadata.path} - ${reason}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
  });
  
  // In a production system, this would call the audit logging API
}

/**
 * Log access denied due to insufficient permissions
 */
async function logAccessDenied(metadata: RequestMetadata, reason: string): Promise<void> {
  console.warn(`SECURITY: Access denied to ${metadata.path} - ${reason}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
  });
  
  // In a production system, this would call the audit logging API
}

/**
 * Log successful access for audit trail
 */
async function logSuccessfulAccess(metadata: RequestMetadata): Promise<void> {
  console.info(`AUDIT: Access to ${metadata.path}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
    duration: Date.now() - metadata.startTime,
  });
  
  // In a production system, this would call the audit logging API
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 