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
    console.log('[GET] Verificando admin...');
    await verifyAdmin(request);
    const db = await connectDB();
    console.log('[GET] Conexión DB establecida.');

    const [rows]: any = await db.execute(`
      SELECT id, nombre, direccion, telefono, creado_en
      FROM almacenes
      ORDER BY id DESC
    `);

    console.log('[GET] Almacenes obtenidos:', rows.length);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[GET] Error:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[POST] Verificando admin...');
    await verifyAdmin(request);
    const db = await connectDB();
    console.log('[POST] Conexión DB establecida.');

    const body = await request.json();
    console.log('[POST] Body recibido:', body);

    const { nombre, direccion, telefono } = body;

    if (!nombre || !direccion || !telefono) {
      console.warn('[POST] Faltan campos obligatorios');
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [result] = await db.execute(
      'INSERT INTO almacenes (nombre, direccion, telefono, creado_en) VALUES (?, ?, ?, NOW())',
      [nombre, direccion, telefono]
    );
    console.log('[POST] Resultado INSERT:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Almacén creado' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[POST] Error:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    console.log('[PUT] Verificando admin...');
    await verifyAdmin(request);
    const db = await connectDB();
    console.log('[PUT] Conexión DB establecida.');

    const body = await request.json();
    console.log('[PUT] Body recibido:', body);

    const { id, nombre, direccion, telefono } = body;

    if (!id || !nombre || !direccion || !telefono) {
      console.warn('[PUT] Faltan campos obligatorios');
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [result] = await db.execute(
      'UPDATE almacenes SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?',
      [nombre, direccion, telefono, id]
    );
    console.log('[PUT] Resultado UPDATE:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Almacén actualizado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[PUT] Error:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    console.log('[DELETE] Verificando admin...');
    await verifyAdmin(request);
    const db = await connectDB();
    console.log('[DELETE] Conexión DB establecida.');

    const body = await request.json();
    console.log('[DELETE] Body recibido:', body);

    const { id } = body;

    if (!id) {
      console.warn('[DELETE] Falta id de almacén');
      return new Response(
        JSON.stringify({ error: 'Falta id de almacén' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [result] = await db.execute('DELETE FROM almacenes WHERE id = ?', [id]);
    console.log('[DELETE] Resultado DELETE:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Almacén eliminado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
