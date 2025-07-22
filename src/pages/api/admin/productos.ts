import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

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

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const [rows]: any = await db.execute(
      `SELECT p.id, p.nombre, c.nombre AS categoria, p.categoria_id, p.precio, p.imagen, p.description
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       ORDER BY p.id DESC`
    );

    return new Response(JSON.stringify({ productos: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en API productos:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const body = await request.json();
    const { nombre, categoria_id, precio, imagen, description } = body;

    if (!nombre || !categoria_id || precio == null) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios (nombre, categoria_id, precio)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.execute(
      'INSERT INTO productos (nombre, categoria_id, precio, imagen, description) VALUES (?, ?, ?, ?, ?)',
      [nombre, categoria_id, precio, imagen || '', description || '']
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Producto creado' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al guardar producto:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
