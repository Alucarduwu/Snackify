import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}
