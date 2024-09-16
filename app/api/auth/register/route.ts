import { NextRequest, NextResponse } from "next/server";
import { UserLogin } from "@/app/lib/types";
import  { genSaltSync,hashSync} from "bcrypt-ts"
import { randomUUID } from "crypto";
export async function POST(req:NextRequest) {
    const userLogin:UserLogin=await req.json();
    const salt=genSaltSync(10);
    const hashedPassword=hashSync(userLogin.password,salt);
    const newUser={id:randomUUID(),user:userLogin.user,hashedPassword:hashedPassword};

    //store new user in database here
    console.log(newUser)
    
    return NextResponse.json(
        { message: `User created Succesfully!`},
        { status: 200}
      );
    
}