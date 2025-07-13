import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../lib/db';
import bcrypt from 'bcrypt';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'No autorizado, token faltante' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const { username, email, password } = await request.json();

    if (!username || !email) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();

    // Verifica si el email ya existe (excluyendo el propio usuario)
    const [emailCheck]: any = await db.execute(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [email, payload.id]
    );
    if (emailCheck.length > 0) {
      return new Response(
        JSON.stringify({ error: 'El correo ya está registrado' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verifica si el username ya existe (excluyendo el propio usuario)
    const [userCheck]: any = await db.execute(
      'SELECT id FROM usuarios WHERE username = ? AND id != ?',
      [username, payload.id]
    );
    if (userCheck.length > 0) {
      return new Response(
        JSON.stringify({ error: 'El nombre de usuario ya está en uso' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Actualiza datos
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute(
        'UPDATE usuarios SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, hashedPassword, payload.id]
      );
    } else {
      // No cambia contraseña si no se envía o es muy corta
      await db.execute(
        'UPDATE usuarios SET username = ?, email = ? WHERE id = ?',
        [username, email, payload.id]
      );
    }

    return new Response(
      JSON.stringify({ message: 'Usuario actualizado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
