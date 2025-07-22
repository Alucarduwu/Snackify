export const prerender = false;

import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../lib/db';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'No autorizado, token faltante' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const db = await connectDB();

    // Ahora hacemos JOIN para obtener el nombre del rol
    const [userRows]: any = await db.execute(
      `SELECT u.id, u.username, u.email, u.perfil, r.nombre AS role
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    );

    if (userRows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = userRows[0];

    // Imagen por defecto si no tiene
    if (!user.perfil) {
      user.perfil = '/Img/User/LICHT.webp'; // Ajusta la ruta si es necesario
    }

    // Traer direcciones (con referencia incluida)
    const [direccionRows]: any = await db.execute(
      'SELECT id, calle, ciudad, estado, codigo_postal, pais, referencia FROM direcciones WHERE usuario_id = ?',
      [payload.id]
    );

    // Traer métodos de pago
    const [metodoPagoRows]: any = await db.execute(
      'SELECT id, tipo, numero, cvv, expiration, logo FROM metodos_pago WHERE usuario_id = ?',
      [payload.id]
    );

    // Traer órdenes del usuario
    const [ordenesRows]: any = await db.execute(
      'SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY fecha DESC',
      [payload.id]
    );

    // Por cada orden, traer los productos asociados con JOIN
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
WHERE op.orden_id = ?
`,
        [orden.id]
      );
      orden.productos = productosRows ?? [];
    }

    // Adjuntar direcciones, métodos de pago y órdenes al objeto user
    user.direcciones = direccionRows ?? [];
    user.metodos_pago = metodoPagoRows ?? [];
    user.ordenes = ordenesRows ?? [];

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
