import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../../lib/db';

const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado, token faltante');
  }
  const token = authHeader.split(' ')[1];
  const { payload } = await jwtVerify(token, JWT_SECRET);
  console.log('JWT payload:', payload);
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

// Extraer id de la URL si existe, asegurando que es un número y que no es 'productos'
function getIdFromUrl(url: URL) {
  const parts = url.pathname.split('/').filter(Boolean); // quita strings vacíos
  // La ruta esperada: /api/admin/productos/:id
  // Entonces id es el último segmento si es distinto de 'productos'
  if (parts.length >= 4 && parts[3] !== 'productos') {
    const id = parts[4]; // parts: ['api','admin','productos','ID']
    if (id && !isNaN(Number(id))) {
      return id;
    }
  }
  return null;
}

export const prerender = false;

// Debe ser ALL mayúsculas para capturar todos los métodos HTTP en Astro
export const ALL: APIRoute = async ({ request, url }) => {
  try {
    await verifyAdmin(request);
    const db = await connectDB();
    const method = request.method.toUpperCase();
    const id = getIdFromUrl(url);

    if (method === 'GET') {
      if (id) {
        // Obtener un solo producto
        const [rows]: any = await db.execute(
          'SELECT id, nombre, categoria, precio, imagen, description FROM productos WHERE id = ?',
          [id]
        );
        if (rows.length === 0) {
          return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        console.log('Producto obtenido:', rows[0]);
        return new Response(JSON.stringify(rows[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        // Obtener todos los productos
        const [rows]: any = await db.execute(
          'SELECT id, nombre, categoria, precio, imagen, description FROM productos ORDER BY id DESC'
        );
        console.log('Productos obtenidos:', rows);
        return new Response(JSON.stringify({ productos: rows }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (method === 'POST') {
      const body = await request.json();
      console.log('Datos recibidos para crear producto:', body);
      const { nombre, categoria, precio, imagen, description } = body;

      if (!nombre || !categoria || precio == null) {
        return new Response(
          JSON.stringify({ error: 'Faltan campos obligatorios (nombre, categoria, precio)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await db.execute(
        'INSERT INTO productos (nombre, categoria, precio, imagen, description) VALUES (?, ?, ?, ?, ?)',
        [nombre, categoria, precio, imagen || '', description || '']
      );

      return new Response(
        JSON.stringify({ success: true, message: 'Producto creado' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'PUT') {
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Falta id en la URL para actualización' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const body = await request.json();
      console.log('Datos recibidos para actualizar producto:', body);
      const { nombre, categoria, precio, imagen, description } = body;

      if (!nombre || !categoria || precio == null) {
        return new Response(
          JSON.stringify({ error: 'Faltan campos obligatorios (nombre, categoria, precio)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await db.execute(
        'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, imagen = ?, description = ? WHERE id = ?',
        [nombre, categoria, precio, imagen || '', description || '', id]
      );

      return new Response(
        JSON.stringify({ success: true, message: 'Producto actualizado' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'DELETE') {
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Falta id en la URL para eliminar' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await db.execute('DELETE FROM productos WHERE id = ?', [id]);

      return new Response(
        JSON.stringify({ success: true, message: 'Producto eliminado' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Método no soportado' }), { status: 405 });
  } catch (error) {
    console.error('Error en API productos:', error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
