import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionData } from "@/app/lib/types";
import { serialize } from "cookie";
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionData) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${process.env.SESSION_DURATION}h`)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return
  }
}

export async function createSessionCookie(sessionData: SessionData): Promise<string> {
  const encryptedSessionData =await encrypt(sessionData);
  const cookie = serialize("session", encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * parseFloat(process.env.SESSION_DURATION || "24"), // One week
    path: "/",
    domain: "localhost"
  });
  return cookie
}
