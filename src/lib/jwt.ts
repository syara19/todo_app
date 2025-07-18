import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signJwt(payload: Record<string, any>) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Token expires in 2 hours
    .sign(secret)
  return jwt
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('JWT Verification failed:', error)
    return null
  }
}