import { NextRequest, NextResponse } from "next/server";
import { UserLogin } from "@/app/lib/types";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/crypto";
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: `OK`,data:{users:[{id:"1",user:"michael",},{id:"2",user:"1234"}]} },
    { status: 200 }
  );
}
