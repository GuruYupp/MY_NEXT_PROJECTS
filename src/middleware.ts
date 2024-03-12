import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    try{
  let isLoggedin = request.cookies.get('isLoggedin')
  
  let isprotectedPath = request.nextUrl.pathname.startsWith('/settings') || request.nextUrl.pathname.startsWith('/profiles')
  
  if (isprotectedPath) {
    if(!isLoggedin){
    
        return NextResponse.redirect(new URL('/signin',request.url))
    }
  }

  if(isLoggedin && isLoggedin.value === "true"){
    let hasuserprofiles = request.cookies.get('hasuserprofiles')?.value
    let notallowedPaths = request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/forgotpassword')
    let profileExpiry = request.cookies.get('profileExpiry')
    
    if(notallowedPaths){
        return NextResponse.redirect(new URL('/',request.url))
    }
    if(!request.nextUrl.pathname.includes('/profiles') && ((profileExpiry?.value && Number(profileExpiry.value) < new Date().getTime()) || !profileExpiry) && hasuserprofiles === 'true'){
        return NextResponse.redirect(new URL('/profiles/select-user-profile',request.url))
    }
  }
}
catch(err){
    console.log(err)
}
 
}
export const config = {
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
    matcher: ['/((?!api|_next|.*\\..*).*)']
  };