import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { id, calle, ciudad, estado, codigo_postal, pais, referencia } = body;

    if (!id || !calle || !ciudad || !estado || !codigo_postal || !pais) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await connectDB();

    const [result]: any = await db.execute(
      `UPDATE direcciones 
       SET calle = ?, ciudad = ?, estado = ?, codigo_postal = ?, pais = ?, referencia = ? 
       WHERE id = ? AND usuario_id = ?`,
      [calle, ciudad, estado, codigo_postal, pais, referencia ?? null, id, payload.id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Dirección no encontrada o no autorizada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Dirección actualizada correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
