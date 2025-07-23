import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';
import { connectDB } from '../../lib/db';
import crypto from 'crypto';

const ENCRYPTION_KEY_HEX = '77e0c04e3c167a659209ece3085de0be857d33ee251d6e86cc89addd14a69e2d';
const IV_HEX = '76b016b1ce1ab417d8194457e148dc19';

const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
const IV = Buffer.from(IV_HEX, 'hex');

function decrypt(encryptedText: string) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e1) {
    try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e2) {
      console.warn('Fallo desencriptar tarjeta:', e2);
      return '************';
    }
  }
}

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

    if (!user.perfil) {
      user.perfil = '/Img/User/LICHT.webp';
    }

    let ordenesRows;
    if (user.role === 'admin' || user.role === 'empleado') {
      const [allOrders]: any = await db.execute(
        `SELECT o.*, u.username, u.email,
                CONCAT(
                  d.calle, ', ', d.ciudad, ', ', d.estado, ', ', d.pais, ', CP: ', d.codigo_postal,
                  IF(d.referencia IS NOT NULL AND d.referencia != '', CONCAT(' (', d.referencia, ')'), '')
                ) AS direccion,
                mp.numero AS metodo_pago
         FROM ordenes o
         JOIN usuarios u ON o.usuario_id = u.id
         JOIN direcciones d ON o.direccion_id = d.id
         JOIN metodos_pago mp ON o.metodo_pago_id = mp.id
         ORDER BY o.fecha DESC`
      );
      ordenesRows = allOrders;
    } else {
      const [userOrders]: any = await db.execute(
        `SELECT o.*, u.username, u.email,
          CONCAT(
            d.calle, ', ', d.ciudad, ', ', d.estado, ', ', d.pais, ', CP: ', d.codigo_postal,
            IF(d.referencia IS NOT NULL AND d.referencia != '', CONCAT(' (', d.referencia, ')'), '')
          ) AS direccion,
          mp.numero AS metodo_pago
         FROM ordenes o
         JOIN usuarios u ON o.usuario_id = u.id
         JOIN direcciones d ON o.direccion_id = d.id
         JOIN metodos_pago mp ON o.metodo_pago_id = mp.id
         WHERE o.usuario_id = ?
         ORDER BY o.fecha DESC`,
        [user.id]
      );
      ordenesRows = userOrders;
    }

    // Desencriptar método de pago y mostrar solo los últimos 4 dígitos
    ordenesRows.forEach((orden: any) => {
      const numero = decrypt(orden.metodo_pago);
      orden.metodo_pago = '**** **** **** ' + numero.slice(-4);
    });

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

// PATCH y POST no se modificaron, quedan exactamente como los tenías.


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
