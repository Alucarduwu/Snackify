// src/scripts/seed-products.ts
import productsData from '../../utils/productsData';
import { connectDB } from '../../lib/db';

async function seedProducts() {
  const connection = await connectDB();

  try {
    for (const product of productsData) {
      // Verifica si el producto ya existe para evitar duplicados
      const [rows] = await connection.execute(
        'SELECT id FROM productos WHERE id = ?',
        [product.id]
      );

      if ((rows as any[]).length === 0) {
        await connection.execute(
  'INSERT INTO productos (id, nombre, categoria, precio, imagen, description) VALUES (?, ?, ?, ?, ?, ?)',
  [
    product.id,
    product.name,       // esto va a nombre
    product.category,   // esto va a categoria
    product.price,      // esto va a precio
    product.image,      // esto va a imagen
    product.description // esto va a description
  ]
);

        console.log(`✔ Producto insertado: ${product.name}`);
      } else {
        console.log(`↪ Producto ya existe: ${product.name}`);
      }
    }

    console.log('\n✅ Todos los productos fueron insertados.');
  } catch (err) {
    console.error('❌ Error insertando productos:', err);
  } finally {
    await connection.end();
  }
}

seedProducts();
