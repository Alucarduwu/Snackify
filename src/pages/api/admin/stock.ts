import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

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

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    // Retornamos productos con su stock por almacén
    const [rows]: any = await db.execute(`
      SELECT s.id, s.producto_id, s.almacen_id, s.cantidad, s.fecha_actualizacion,
             p.nombre AS producto_nombre,
             a.nombre AS almacen_nombre
      FROM stock s
      JOIN productos p ON s.producto_id = p.id
      JOIN almacenes a ON s.almacen_id = a.id
      ORDER BY s.id DESC
    `);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();
    const body = await request.json();
    const { producto_id, almacen_id, cantidad } = body;

    if (!producto_id || !almacen_id || cantidad == null) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Primero, verificamos si ya existe un stock para ese producto y almacen
    const [existing]: any = await db.execute(
      'SELECT id FROM stock WHERE producto_id = ? AND almacen_id = ?',
      [producto_id, almacen_id]
    );

    if (existing.length > 0) {
      // Actualizamos el stock existente
      await db.execute(
        'UPDATE stock SET cantidad = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [cantidad, existing[0].id]
      );
      return new Response(
        JSON.stringify({ success: true, message: 'Stock actualizado' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insertamos nuevo stock
    await db.execute(
      'INSERT INTO stock (producto_id, almacen_id, cantidad, fecha_actualizacion) VALUES (?, ?, ?, NOW())',
      [producto_id, almacen_id, cantidad]
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Stock agregado' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Falta id de stock' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.execute('DELETE FROM stock WHERE id = ?', [id]);

    return new Response(
      JSON.stringify({ success: true, message: 'Stock eliminado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
