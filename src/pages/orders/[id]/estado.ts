// src/pages/api/orders/[id]/estado.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;

    const orderId = Number(params.id);
    const { estado } = await request.json();

    const db = await connectDB();

    const [userRows]: any = await db.execute('SELECT role FROM usuarios WHERE id = ?', [userId]);
    const role = userRows?.[0]?.role;

    if (!role) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (role !== 'admin' && role !== 'empleado') {
      const [ordenRows]: any = await db.execute(
        'SELECT usuario_id FROM ordenes WHERE id = ?',
        [orderId]
      );
      if (ordenRows.length === 0 || ordenRows[0].usuario_id !== userId) {
        return new Response(JSON.stringify({ error: 'Sin permiso' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const [result]: any = await db.execute(
      'UPDATE ordenes SET estado = ? WHERE id = ?',
      [estado, orderId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'No se encontró la orden' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

