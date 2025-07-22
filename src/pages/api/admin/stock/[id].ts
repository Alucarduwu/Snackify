import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../../lib/db';
export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado, token faltante');
  }
  const token = authHeader.split(' ')[1];
  const { payload } = await jwtVerify(token, JWT_SECRET);
  if (payload.role !== 'admin') {
    throw new Error('No autorizado, solo admin');
  }
  return payload;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Error desconocido';
  }
}

function getIdFromUrl(url: URL) {
  const parts = url.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1]; // El último segmento es el id
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const id = getIdFromUrl(url);
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Id inválido' }), { status: 400 });
    }

    // Obtener stock con nombres de producto y almacen
    const [rows]: any = await db.execute(
      `SELECT s.id, s.producto_id, s.almacen_id, s.cantidad, s.fecha_actualizacion,
              p.nombre AS producto_nombre, a.nombre AS almacen_nombre
       FROM stock s
       JOIN productos p ON s.producto_id = p.id
       JOIN almacenes a ON s.almacen_id = a.id
       WHERE s.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Stock no encontrado' }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error GET stock:', error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, url }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const id = getIdFromUrl(url);
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Id inválido para actualización' }), { status: 400 });
    }

    const body = await request.json();
    const { producto_id, almacen_id, cantidad } = body;

    if (!producto_id || !almacen_id || cantidad == null) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
    }

    await db.execute(
      `UPDATE stock
       SET producto_id = ?, almacen_id = ?, cantidad = ?, fecha_actualizacion = NOW()
       WHERE id = ?`,
      [producto_id, almacen_id, cantidad, id]
    );

    return new Response(JSON.stringify({ success: true, message: 'Stock actualizado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error PUT stock:', error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const id = getIdFromUrl(url);
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Id inválido para eliminar' }), { status: 400 });
    }

    await db.execute('DELETE FROM stock WHERE id = ?', [id]);

    return new Response(JSON.stringify({ success: true, message: 'Stock eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error DELETE stock:', error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 500 });
  }
};
