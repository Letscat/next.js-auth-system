import { NextRequest, NextResponse } from "next/server";
import { SessionData, UserLogin } from "@/app/lib/types";
import { compareSync } from "bcrypt-ts";
import { createSessionCookie } from "@/app/lib/crypto";
import { randomUUID } from "crypto";
export async function POST(req:NextRequest) {
    const loginAttempt:UserLogin=await req.json();

    //fetch user from database here, for now hardcoded
    const user={id:"1",perms:["/users"],hashedPassword:"$2a$10$uBuAS5Sz/2vvsILO.CewF.ynuovAq/e.Y36VBzcO8UIbQXtSwpZ.m"}

    const isMatch=compareSync(loginAttempt.password,user.hashedPassword)
    if(!isMatch){
        return NextResponse.json(
            { message: "Invalid User/Password" },
            { status: 401, }
          );
    }

    const sessionData:SessionData={id:randomUUID(),userId:user.id,perms:user.perms}
    const cookie=await createSessionCookie(sessionData)
    return NextResponse.json(
        { message: "Logged in successfully" },
        { status: 200,headers:{"Set-Cookie":cookie} }
      );
    
}