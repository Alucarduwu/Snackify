import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const body = await request.json();

    const db = await connectDB();

    await db.execute(
      `INSERT INTO direcciones (usuario_id, calle, ciudad, estado, codigo_postal, pais, referencia)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        body.calle,
        body.ciudad,
        body.estado,
        body.codigo_postal,
        body.pais,
        body.referencia ?? '',
      ]
    );

    return new Response(JSON.stringify({ message: 'Dirección guardada correctamente' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al guardar dirección:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};
