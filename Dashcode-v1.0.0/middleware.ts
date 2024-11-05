import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {locales} from '@/config';

export default function middleware(request: NextRequest) {
  const defaultLocale = request.headers.get('dashcode-locale') || 'en';
  
  return createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    // Add this to ensure locales are always in the URL
    localePrefix: 'always'
  })(request);
}

export const config = {
  // Fix the matcher pattern
  matcher: ['/((?!api|_next|.*\\..*).*)']
};