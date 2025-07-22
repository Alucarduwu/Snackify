import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';
import crypto from 'crypto';

export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

// Clave e IV embebidos (solo para pruebas)
const ENCRYPTION_KEY_HEX = '77e0c04e3c167a659209ece3085de0be857d33ee251d6e86cc89addd14a69e2d';
const IV_HEX = '76b016b1ce1ab417d8194457e148dc19';

// Convertir a buffers
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
const IV = Buffer.from(IV_HEX, 'hex');

// Validaciones
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(`ENCRYPTION_KEY Buffer inválido: longitud ${ENCRYPTION_KEY.length} bytes`);
}
if (IV.length !== 16) {
  throw new Error(`IV Buffer inválido: longitud ${IV.length} bytes`);
}

function encrypt(text: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
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
  // Tu código POST sin cambios (funciona bien)
  try {
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

    const body = await request.json();
    const { numero, tipo, logo, cvv, expiration } = body;

    if (!numero || !tipo || !logo || !cvv || !expiration) {
      return new Response(
        JSON.stringify({ success: false, message: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCardNumber(numero)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Número de tarjeta inválido (15 o 16 dígitos)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCVV(cvv)) {
      return new Response(
        JSON.stringify({ success: false, message: 'CVV inválido (3 o 4 dígitos)' }),
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

    const encryptedNumber = encrypt(numero);
    const encryptedCVV = encrypt(cvv);

    await db.execute(
      `INSERT INTO metodos_pago (usuario_id, numero, tipo, logo, cvv, expiration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [payload.id, encryptedNumber, tipo, logo, encryptedCVV, expiration]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Método de pago guardado correctamente',
        ultimos4: numero.slice(-4)
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error al guardar método de pago:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
  try {
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

    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT id, numero, tipo, logo, expiration FROM metodos_pago WHERE usuario_id = ?`,
      [payload.id]
    );

    // Mapear y mostrar solo últimos 4 dígitos del número desencriptado,
    // saltando los que tienen longitud inválida para AES (no múltiplo de 32 hex)
    const metodos = (rows as any[]).map((m) => {
      let ultimos4 = '????';
      try {
        if (typeof m.numero !== 'string' || m.numero.length % 32 !== 0) {
          throw new Error(`Longitud inválida para AES: ${m.numero.length}`);
        }
        ultimos4 = decrypt(m.numero).slice(-4);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn(`No se pudo desencriptar número de tarjeta con id ${m.id}:`, error.message);
        } else {
          console.warn(`No se pudo desencriptar número de tarjeta con id ${m.id}:`, error);
        }
      }
      return {
        id: m.id,
        tipo: m.tipo,
        logo: m.logo,
        expiration: m.expiration,
        ultimos4,
      };
    });

    return new Response(
      JSON.stringify({ success: true, metodos }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error al obtener métodos de pago:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
