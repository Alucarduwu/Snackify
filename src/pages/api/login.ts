import { connectDB } from '../../lib/db';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

export const prerender = false;
const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();

    // Consulta con JOIN para obtener rol
    const [rows]: any = await db.execute(
      `SELECT u.id, u.username, u.email, u.password, r.nombre AS role
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const role = user.role?.trim()?.toLowerCase() || 'user';

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    // 🧭 Redirección según el rol
    const redirectTo =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'empleado'
        ? '/admin/empleado'
        : '/';

    return new Response(
      JSON.stringify({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role,
        },
        redirectTo, // 👈 Esto es lo que usa el frontend para redirigir
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
