import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';
import bcrypt from 'bcrypt';

export const prerender = false;


const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Error desconocido';
  }
}

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

export const GET: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();

    const [rows]: any = await db.execute(`
      SELECT u.id, u.username, u.email, r.nombre AS role
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id DESC
    `);

    return new Response(JSON.stringify({ users: rows }), {
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
    const { username, email, password, role } = body;

    if (!username || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar que el email no exista
    const [existing]: any = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: 'El correo ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener role_id de roles según nombre de rol
    const [roleRows]: any = await db.execute('SELECT id FROM roles WHERE nombre = ?', [role]);
    if (roleRows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Rol inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const roleId = roleRows[0].id;

    await db.execute(
      'INSERT INTO usuarios (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, roleId]
    );

    return new Response(JSON.stringify({ success: true, message: 'Usuario creado' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();
    const body = await request.json();
    const { id, username, email, password, role } = body;

    if (!id || !username || !email || !role) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener role_id
    const [roleRows]: any = await db.execute('SELECT id FROM roles WHERE nombre = ?', [role]);
    if (roleRows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Rol inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const roleId = roleRows[0].id;

    // Si cambian password, la actualizamos
    let query = 'UPDATE usuarios SET username = ?, email = ?, role_id = ?';
    const params: any[] = [username, email, roleId];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.execute(query, params);

    return new Response(JSON.stringify({ success: true, message: 'Usuario actualizado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
        JSON.stringify({ error: 'Falta id de usuario' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

    return new Response(JSON.stringify({ success: true, message: 'Usuario eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
