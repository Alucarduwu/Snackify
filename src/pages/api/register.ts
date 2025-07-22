import { connectDB } from '../../lib/db';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

// Función para validar la seguridad de la contraseña
function isPasswordSecure(password: string): boolean {
  const secureRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/#])[A-Za-z\d@$!%*?&/#]{8,}$/;
  return secureRegex.test(password);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      username,
      'last-name': lastName,
      email,
      password,
      'confirm-password': confirmPassword,
    } = body;

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

    if (!isPasswordSecure(password)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectDB();

    const [rows]: any = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'El correo ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let roleId = 3; // user por defecto
    const emailLower = email.toLowerCase();

    if (emailLower === 'admin@admin.com') {
      roleId = 1;
    } else if (emailLower.endsWith('@empleado.com')) {
      roleId = 2;
    }

    const safeLastName = lastName ?? '';

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

    const token = await new SignJWT({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const redirectMap: Record<string, string> = {
      admin: '/admin/dashboard',
      empleado: '/admin/empleado',
      user: '/',
    };

    const redirectTo = redirectMap[newUser.role] || '/';

    return new Response(
      JSON.stringify({
        success: true,
        user: newUser,
        redirectTo,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict${
            import.meta.env.PROD ? '; Secure' : ''
          }`,
        },
      }
    );
  } catch (err) {
    console.error('Error en registro:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
