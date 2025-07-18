import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// export default withAuth(
//   async function middleware(req) {
//     const { pathname, searchParams } = req.nextUrl
//     const token = req.nextauth.token

//     // Redirect to login if not authenticated and trying to access protected pages
//     if (!token && !['/login', '/register'].includes(pathname)) {
//       const url = new URL('/login', req.url)
//       url.searchParams.set('callbackUrl', pathname)
//       return NextResponse.redirect(url)
//     }

//     // Redirect authenticated users trying to access login/register
//     if (token && (pathname === '/login' || pathname === '/register')) {
//       return NextResponse.redirect(new URL('/', req.url))
//     }

//     // Example: Role-based access control for an admin page
//     if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/', req.url))
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Allow access to public URLs without authentication
//         const publicUrls = ['/login', '/register', '/api/login', '/api/register']
//         if (publicUrls.some(url => req.nextUrl.pathname.startsWith(url))) {
//           return true
//         }
//         // For other routes, only allow if there's a token
//         return !!token
//       },
//     },
//   }
// )

// export const config = {
//   matcher: [
//     '/',
//     '/todo/:path*',
//     '/login',
//     '/register',
//     '/api/todos/:path*',
//     '/api/login',
//     '/api/register',
//   ],
// }

export default async function middleware(request){
  const loginPath = ['/login', '/register']

  const accessToken = request.cookies.get(process.env.JWT)
}