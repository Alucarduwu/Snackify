import userData from './userData'; 
import type { User } from './userData';

export interface Producto {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Pedido {
  idPedido: string;
  fecha: string;
  productos: Producto[];
  total: number;
  estado: 'pendiente' | 'enviado' | 'entregado' | 'cancelado';
  metodoPago: 'tarjeta' | 'efectivo' | 'transferencia';
  usuario: User;
}

const pedidos: Pedido[] = [
  {
    idPedido: 'PED-001',
    fecha: '2025-05-25',
    productos: [
      {
        id: 1,
        name: 'Chocolate Amargo',
        category: 'Chocolatería',
        price: 50,
        quantity: 2,
        image: '/Img/Products/Chocolateria/Chocolate_Amargo.webp'
      },
      {
        id: 10,
        name: 'Bombones de Chocolate',
        category: 'Chocolatería',
        price: 62,
        quantity: 1,
        image: '/Img/Products/Chocolateria/Bombones_de_Chocolate.webp'
      }
    ],
    total: 162,
    estado: 'pendiente',
    metodoPago: 'tarjeta',
    usuario: userData
  },
  {
    idPedido: 'PED-002',
    fecha: '2025-05-26',
    productos: [
      {
        id: 31,
        name: 'Cheesecake',
        category: 'Postres',
        price: 85,
        quantity: 1,
        image: '/Img/Products/Postres/Cheesecake.webp'
      },
      {
        id: 32,
        name: 'Pastel de Chocolate',
        category: 'Postres',
        price: 90,
        quantity: 1,
        image: '/Img/Products/Postres/Pastel_de_Chocolate.webp'
      },
      {
        id: 33,
        name: 'Brownie',
        category: 'Postres',
        price: 60,
        quantity: 2,
        image: '/Img/Products/Postres/brownie.webp'
      }
    ],
    total: 295,
    estado: 'enviado',
    metodoPago: 'tarjeta',
    usuario: userData
  },
  {
    idPedido: 'PED-003',
    fecha: '2025-05-27',
    productos: [
      {
        id: 5,
        name: 'Barras Rellenas',
        category: 'Chocolatería',
        price: 48,
        quantity: 3,
        image: '/Img/Products/Chocolateria/Barras_Rellenas.webp'
      },
      {
        id: 63,
        name: 'Malvaviscos Surtidos',
        category: 'Malvaviscos',
        price: 22,
        quantity: 2,
        image: '/Img/Products/Malvaviscos/Malvaviscos_Surtidos.webp'
      },
      {
        id: 6,
        name: 'Chocolate Blanco',
        category: 'Chocolatería',
        price: 52,
        quantity: 1,
        image: '/Img/Products/Chocolateria/Chocolate_Blanco.webp'
      }
    ],
    total: 190,
    estado: 'entregado',
    metodoPago: 'tarjeta',
    usuario: userData
  }
];

export default pedidos;
