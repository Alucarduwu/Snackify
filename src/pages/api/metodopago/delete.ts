// src/pages/api/metodopago/delete.ts
import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

export const prerender = false;

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar token de autorización
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Token no proporcionado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: 'Token inválido o expirado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener id del método de pago a eliminar
    const { id } = await request.json();
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID del método de pago requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Conexión a la base de datos y eliminación
    const db = await connectDB();
    const [result]: any = await db.execute(
      'DELETE FROM metodos_pago WHERE id = ? AND usuario_id = ?',
      [id, payload.id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Método de pago no encontrado o no autorizado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Método de pago eliminado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
