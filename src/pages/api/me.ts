export const prerender = false;

import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../lib/db';
import crypto from 'crypto';

// Clave e IV deben coincidir con las usadas para encriptar
const ENCRYPTION_KEY_HEX = '77e0c04e3c167a659209ece3085de0be857d33ee251d6e86cc89addd14a69e2d';
const IV_HEX = '76b016b1ce1ab417d8194457e148dc19';

const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
const IV = Buffer.from(IV_HEX, 'hex');

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

function decrypt(encryptedText: string) {
  try {
    // Intentamos como hex primero
    console.log('Intentando desencriptar (hex):', encryptedText);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Desencriptado con hex:', decrypted);
    return decrypted;
  } catch (hexError) {
    console.warn('No se pudo desencriptar como hex, intentando base64...', hexError);
    try {
      // Intentamos como base64 si hex falla
      console.log('Intentando desencriptar (base64):', encryptedText);
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      console.log('Desencriptado con base64:', decrypted);
      return decrypted;
    } catch (base64Error) {
      console.error('Error desencriptando texto:', base64Error);
      throw base64Error;
    }
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Token no proporcionado o mal formado');
      return new Response(
        JSON.stringify({ error: 'No autorizado, token faltante' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Payload del token:', payload);

    const db = await connectDB();

    // Usuario con rol
    const [userRows]: any = await db.execute(
      `SELECT u.id, u.username, u.email, u.perfil, r.nombre AS role
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    );

    if (userRows.length === 0) {
      console.warn('Usuario no encontrado en DB:', payload.id);
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = userRows[0];
    console.log('Datos de usuario:', user);

    if (!user.perfil) {
      user.perfil = '/Img/User/LICHT.webp';
    }

    // Direcciones
    const [direccionRows]: any = await db.execute(
      'SELECT id, calle, ciudad, estado, codigo_postal, pais, referencia FROM direcciones WHERE usuario_id = ?',
      [payload.id]
    );
    console.log('Direcciones encontradas:', direccionRows.length);

    // Métodos de pago: desencriptar número y obtener ultimos4
    const [metodoPagoRows]: any = await db.execute(
      'SELECT id, tipo, numero, cvv, expiration, logo FROM metodos_pago WHERE usuario_id = ?',
      [payload.id]
    );
    console.log('Métodos de pago encontrados:', metodoPagoRows.length);

    const metodosPago = metodoPagoRows.map((m: any) => {
      let ultimos4 = '????';
      try {
        console.log(`Número cifrado de tarjeta id ${m.id}:`, m.numero);
        const numeroDesencriptado = decrypt(m.numero);
        ultimos4 = numeroDesencriptado.slice(-4);
      } catch (err) {
        console.warn(`No se pudo desencriptar número de tarjeta con id ${m.id}`);
      }

      return {
        id: m.id,
        tipo: m.tipo,
        logo: m.logo,
        expiration: m.expiration,
        ultimos4,
      };
    });

    // Órdenes
    const [ordenesRows]: any = await db.execute(
      'SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY fecha DESC',
      [payload.id]
    );
    console.log('Órdenes encontradas:', ordenesRows.length);

    for (const orden of ordenesRows) {
      const [productosRows]: any = await db.execute(
        `SELECT 
          p.nombre,
          c.nombre AS categoria,
          p.precio,
          op.cantidad,
          p.imagen
        FROM orden_productos op
        JOIN productos p ON op.producto_id = p.id
        JOIN categorias c ON p.categoria_id = c.id
        WHERE op.orden_id = ?`,
        [orden.id]
      );
      orden.productos = productosRows ?? [];
      console.log(`Productos para orden ${orden.id}:`, orden.productos.length);
    }

    user.direcciones = direccionRows ?? [];
    user.metodos_pago = metodosPago;
    user.ordenes = ordenesRows ?? [];

    console.log('Respuesta final con user:', {
      direcciones: user.direcciones.length,
      metodos_pago: user.metodos_pago.length,
      ordenes: user.ordenes.length,
    });

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error general en GET /api/me:', error);
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
