import { NextRequest } from "next/server";

export async function proxy(request:NextRequest){
 console.log(request);
}


export const config = {
    matcher:['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',]
}