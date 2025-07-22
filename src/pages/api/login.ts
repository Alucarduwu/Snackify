import { connectDB } from '../../lib/db';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

export const prerender = false;
const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    console.log('Datos recibidos en login:', { email, passwordExists: !!password });

    if (!email || typeof password !== 'string' || password.length === 0) {
      console.log('Faltan campos obligatorios o contraseña inválida');
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios o contraseña inválida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();
    console.log('Conexión a BD exitosa');

    let rows;
    try {
      [rows] = await db.execute(
        `SELECT u.id, u.username, u.email, u.password, r.nombre AS role
         FROM usuarios u
         JOIN roles r ON u.role_id = r.id
         WHERE u.email = ?`,
        [email]
      );
      console.log(`Consulta de usuario para email ${email} ejecutada`);
    } catch (err) {
      console.error('Error al consultar usuario:', err);
      return new Response(
        JSON.stringify({ error: 'Error interno al consultar usuario' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (rows.length === 0) {
      console.log('Usuario no encontrado');
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = rows[0];
    console.log('Usuario encontrado:', { id: user.id, email: user.email, role: user.role });

    const match = await bcrypt.compare(password, user.password);
    console.log('Resultado comparación contraseña:', match);

    if (!match) {
      console.log('Contraseña incorrecta');
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const role = user.role?.trim()?.toLowerCase() || 'user';
    console.log('Rol detectado:', role);

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

    console.log('Inicio de sesión exitoso, enviando respuesta');
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
        redirectTo,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
