import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { TextEncoder } from "util";

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
  
  export async function signJwt(payload: JWTPayload, expiresIn: string = '1h') {
    console.log('Payload:', payload);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
  }
  
  export async function verifyJwt(token: string) {
    try {
      const { payload } = await jwtVerify(token, secret);
      console.log('Payload:', payload);
      return payload;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return null;
    }
  }