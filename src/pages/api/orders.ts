import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../lib/db';

export const prerender = false;
const JWT_SECRET = new TextEncoder().encode('tu_secreto_super_seguro_aqui');

export const GET: APIRoute = async ({ request }) => {
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
    const db = await connectDB();

    // Obtener datos usuario con join a roles para traer nombre del rol
    const [userRows]: any = await db.execute(
      `SELECT u.id, u.username, u.email, u.perfil, r.nombre AS role
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    );

    if (userRows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = userRows[0];

    // Imagen por defecto si no tiene
    if (!user.perfil) {
      user.perfil = '/Img/User/LICHT.webp';
    }

    // Obtener órdenes según rol
    let ordenesRows;
    if (user.role === 'admin' || user.role === 'empleado') {
      const [allOrders]: any = await db.execute('SELECT * FROM ordenes ORDER BY fecha DESC');
      ordenesRows = allOrders;
    } else {
      const [userOrders]: any = await db.execute(
        'SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY fecha DESC',
        [user.id]
      );
      ordenesRows = userOrders;
    }

    // Traer productos de cada orden con los datos relevantes
    for (const orden of ordenesRows) {
      const [productosRows]: any = await db.execute(
        `SELECT 
           p.nombre AS producto,
           p.precio,
           p.imagen,
           op.cantidad
         FROM orden_productos op
         JOIN productos p ON op.producto_id = p.id
         WHERE op.orden_id = ?`,
        [orden.id]
      );

      orden.productos = productosRows.map((p: any) => ({
        producto: p.producto,
        precio: p.precio,
        imagen: p.imagen,
        cantidad: p.cantidad
      }));

      
    }

    user.ordenes = ordenesRows ?? [];

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;

    const db = await connectDB();

    const url = new URL(request.url);
    const orderIdParam = url.searchParams.get('id');
    if (!orderIdParam) {
      return new Response(JSON.stringify({ error: 'ID de orden faltante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const orderId = Number(orderIdParam);

    const { estado } = await request.json();
    if (!estado) {
      return new Response(JSON.stringify({ error: 'Estado faltante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener rol del usuario con join a roles
    const [userRows]: any = await db.execute(
      `SELECT r.nombre AS role
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );
    if (userRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const role = userRows[0].role;

    if (role !== 'admin' && role !== 'empleado') {
      const [orderRows]: any = await db.execute(
        'SELECT usuario_id FROM ordenes WHERE id = ?',
        [orderId]
      );
      if (orderRows.length === 0 || orderRows[0].usuario_id !== userId) {
        return new Response(JSON.stringify({ error: 'No tiene permiso para modificar esta orden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const [result]: any = await db.execute(
      'UPDATE ordenes SET estado = ? WHERE id = ?',
      [estado, orderId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'No se encontró la orden para actualizar' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No autorizado, token faltante' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;

    const db = await connectDB();

    const { direccionId, metodoPagoId, productos } = await request.json();

    if (!direccionId || !metodoPagoId || !Array.isArray(productos) || productos.length === 0) {
      return new Response(JSON.stringify({ error: 'Datos incompletos para crear la orden' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insertar orden con estado 'pendiente'
    const [result]: any = await db.execute(
      'INSERT INTO ordenes (usuario_id, direccion_id, metodo_pago_id, estado, fecha) VALUES (?, ?, ?, ?, NOW())',
      [userId, direccionId, metodoPagoId, 'pendiente']
    );

    const ordenId = result.insertId;

    // Insertar productos asociados a la orden
    for (const producto of productos) {
      if (!producto.producto_id || !producto.cantidad) {
        return new Response(JSON.stringify({ error: 'Datos de producto incompletos' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await db.execute(
        'INSERT INTO orden_productos (orden_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [ordenId, producto.producto_id, producto.cantidad]
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Orden creada correctamente', ordenId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creando orden:', error);
    return new Response(
      JSON.stringify({ error: 'Error en el servidor al crear la orden' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
