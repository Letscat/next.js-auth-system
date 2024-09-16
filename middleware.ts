import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/crypto'
import { cookies } from 'next/headers'

const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
    let sessionData;
    let path = req.nextUrl.pathname;
    // set the same permission for pages and api endpoints with the same name
    if (path.startsWith("/api")) path = path.slice(4);
    const isPublicRoute = publicRoutes.includes(path);
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // fetch and validate session cookie
    const cookie = cookies().get('session')?.value;
    if (!cookie) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        sessionData = await decrypt(cookie)
    } catch (error) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const hasPerms = sessionData.perms.includes(path);
    if (!hasPerms) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: [
        '/((?!api/auth/register|api/auth/login|_next/static|_next/image|.*\\.png$).*)',
    ]
}
