// src/pages/api/metodopago/update.ts
import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';
import crypto from 'crypto';

export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

// Variables de entorno para cifrado (asegúrate de definirlas)
const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY || '';
const IV_HEX = process.env.IV || '';

if (ENCRYPTION_KEY_HEX.length !== 64 || IV_HEX.length !== 32) {
  throw new Error('ENCRYPTION_KEY e IV deben estar definidos y tener la longitud correcta en hexadecimal');
}

const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
const IV = Buffer.from(IV_HEX, 'hex');

function encrypt(text: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function validateCardNumber(number: string) {
  return /^\d{15,16}$/.test(number);
}

function validateCVV(cvv: string) {
  return /^\d{3,4}$/.test(cvv);
}

function validateExpiration(expiration: string) {
  const [month, year] = expiration.split('/').map(Number);
  if (!month || !year || month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(2000 + year, month);
  return expiry > now;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Token no proporcionado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: 'Token inválido o expirado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extraer y validar campos
    const { id, numero, tipo, logo, cvv, expiration } = await request.json();

    if (!id || !numero || !tipo || !logo || !cvv || !expiration) {
      return new Response(
        JSON.stringify({ success: false, message: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCardNumber(numero)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Número de tarjeta inválido (15 o 16 dígitos numéricos)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCVV(cvv)) {
      return new Response(
        JSON.stringify({ success: false, message: 'CVV inválido (3 o 4 dígitos numéricos)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateExpiration(expiration)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Fecha de expiración inválida o vencida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();

    // Encriptar datos sensibles
    const encryptedNumber = encrypt(numero);
    const encryptedCVV = encrypt(cvv);

    const [result]: any = await db.execute(
      `UPDATE metodos_pago 
       SET numero = ?, tipo = ?, logo = ?, cvv = ?, expiration = ? 
       WHERE id = ? AND usuario_id = ?`,
      [encryptedNumber, tipo, logo, encryptedCVV, expiration, id, payload.id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Método de pago no encontrado o no autorizado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Método de pago actualizado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
