import { connectDB } from '../../lib/db';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, 'last-name': lastName, email, password, 'confirm-password': confirmPassword } = body;

    // Validaciones básicas
    if (!username || !email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Las contraseñas no coinciden' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();

    // Verificar si el email ya está registrado
    const [rows]: any = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'El correo ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Asignar role_id según el correo
    let roleId = 3; // user por defecto
    const emailLower = email.toLowerCase();

    if (emailLower === 'admin@admin.com') {
      roleId = 1; // admin
    } else if (emailLower.endsWith('@empleado.com')) {
      roleId = 2; // empleado
    }

    // Para evitar valores nulos en last_name
    const safeLastName = lastName ?? '';

    // Insertar usuario en la DB
    const [result]: any = await db.execute(
      'INSERT INTO usuarios (username, last_name, email, password, role_id) VALUES (?, ?, ?, ?, ?)',
      [username, safeLastName, email, hashedPassword, roleId]
    );

    if (!result.insertId) {
      return new Response(
        JSON.stringify({ success: false, message: 'No se pudo crear el usuario' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mapeo para devolver el nombre del rol
    const rolesMap: Record<number, string> = {
      1: 'admin',
      2: 'empleado',
      3: 'user',
    };

    const newUser = {
      id: result.insertId,
      username,
      email,
      role: rolesMap[roleId] || 'user',
    };

    return new Response(
      JSON.stringify({ success: true, user: newUser }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Error en registro:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

