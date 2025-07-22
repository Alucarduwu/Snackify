import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado');
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
  try { return JSON.stringify(error); } catch { return 'Error desconocido'; }
}

export const all: APIRoute = async ({ request, params }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();
    const id = params.id;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Falta id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'GET') {
      const [rows]: any = await db.execute('SELECT * FROM productos WHERE id = ?', [id]);
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Producto no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify(rows[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      const { nombre, categoria, precio, imagen, description } = body;
      if (!nombre || !categoria || precio == null) {
        return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const result = await db.execute(
        'UPDATE productos SET nombre=?, categoria=?, precio=?, imagen=?, description=? WHERE id=?',
        [nombre, categoria, precio, imagen || '', description || '', id]
      );
      return new Response(JSON.stringify({ success: true, message: 'Producto actualizado' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'DELETE') {
      await db.execute('DELETE FROM productos WHERE id = ?', [id]);
      return new Response(JSON.stringify({ success: true, message: 'Producto eliminado' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Método no soportado' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
