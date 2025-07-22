-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-07-2025 a las 08:17:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `astro_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacenes`
--

CREATE TABLE `almacenes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacenes`
--

INSERT INTO `almacenes` (`id`, `nombre`, `direccion`, `telefono`, `creado_en`) VALUES
(1, 'al', 'kcnk', 'kncdk', '2025-07-16 14:52:57'),
(2, 'jn', 'editado', ' jc ', '2025-07-22 06:06:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Postres', 'Dulces preparados como pasteles y tartas'),
(2, 'Dulces', 'Caramelos y golosinas en general'),
(3, 'Chocolatería', 'Productos hechos a base de chocolate'),
(4, 'Panadería', 'Productos horneados como panes y bollos'),
(5, 'Malvaviscos', 'Dulces esponjosos y suaves');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `referencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`id`, `usuario_id`, `calle`, `ciudad`, `estado`, `codigo_postal`, `pais`, `referencia`) VALUES
(1, 3, 'jksdkj', 'kjbdsj', 'jbdsvjn', 'jbdjkln', 'knskl', 'ljnsaclk');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `cvv` varchar(10) DEFAULT NULL,
  `expiration` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id`, `usuario_id`, `numero`, `tipo`, `logo`, `cvv`, `expiration`) VALUES
(1, 3, '8489u', 'hjbk', '89u8o', '8789', 'gh89');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `direccion_id` int(11) NOT NULL,
  `metodo_pago_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id`, `usuario_id`, `direccion_id`, `metodo_pago_id`, `fecha`, `estado`) VALUES
(15, 3, 1, 1, '2025-07-21 23:40:03', 'entregado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_productos`
--

CREATE TABLE `orden_productos` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden_productos`
--

INSERT INTO `orden_productos` (`id`, `orden_id`, `producto_id`, `cantidad`) VALUES
(15, 15, 2, 1),
(16, 15, 4, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `imagen`, `description`, `categoria_id`) VALUES
(1, 'Chocolate Amargo', 50.00, '/Img/Products/Chocolateria/Chocolate_Amargo.webp', 'Nuestro Chocolate Amargo es una delicia intensa elaborada con un alto porcentaje de cacao puro, ideal para los verdaderos amantes del chocolate. Su sabor profundo, con notas sutiles de frutos secos y una textura firme que se derrite lentamente en el paladar, lo convierte en la elección perfecta para quienes buscan una experiencia sensorial sofisticada y sin azúcares añadidos.', 3),
(2, 'Trufas Clásicas', 60.00, '/Img/Products/Chocolateria/Trufas_Clasicas.webp', 'Las Trufas Clásicas son pequeñas obras maestras hechas a mano con una mezcla perfecta de ganache suave y cobertura de chocolate amargo espolvoreada con cacao en polvo. Cada bocado es una explosión de sabor cremoso y profundo, que ofrece una experiencia de lujo para los sentidos. Perfectas para regalar o para disfrutar en un momento de indulgencia personal.', 3),
(3, 'Tableta de Cacao 70%', 45.00, '/Img/Products/Chocolateria/Tableta-de-Cacao.webp', 'La Tableta de Cacao 70% es un equilibrio perfecto entre amargor y dulzura, ideal para quienes buscan una experiencia auténtica del cacao. Con ingredientes seleccionados de origen sostenible, esta tableta es rica en antioxidantes, con un aroma profundo y una textura suave que se funde delicadamente en la boca.', 3),
(4, 'Chocolate con Almendras', 55.00, '/Img/Products/Chocolateria/Chocolate-con-Almendras.webp', 'Disfruta de la combinación perfecta entre el sabor del chocolate oscuro y la textura crujiente de almendras tostadas. Esta barra está elaborada con ingredientes de alta calidad y ofrece un contraste delicioso que deleita a cualquier paladar. Un clásico que nunca falla.', 3),
(5, 'Barras Rellenas', 48.00, '/Img/Products/Chocolateria/Barras Rellenas.webp', 'Nuestras Barras Rellenas son una experiencia multisensorial: una capa exterior de chocolate liso y brillante que envuelve un corazón suave y cremoso. Disponibles en una variedad de sabores como avellana, caramelo o fresa, son perfectas para quienes buscan algo más que una barra común.', 3),
(6, 'Chocolate Blanco', 52.00, '/Img/Products/Chocolateria/Chocolate_Blanco.webp', 'El Chocolate Blanco es una delicia cremosa y suave, con un toque de vainilla natural que resalta su dulzura característica. Elaborado con manteca de cacao de alta pureza, este chocolate ofrece una textura sedosa ideal para los más golosos.', 3),
(7, 'Chocolate con Naranja', 53.00, '/Img/Products/Chocolateria/Chocolate con naranja.webp', 'Esta barra combina el intenso sabor del chocolate oscuro con la frescura cítrica de la naranja. El resultado es un equilibrio elegante entre dulzura y acidez, ideal para quienes buscan una experiencia diferente y sofisticada en cada mordida.', 3),
(8, 'Chocolate con Menta', 50.00, '/Img/Products/Chocolateria/Chocomenta.webp', 'Nuestro Chocolate con Menta ofrece una sensación refrescante única, combinando el profundo sabor del chocolate oscuro con la frescura natural de la menta. Perfecto como digestivo o simplemente para disfrutar de un gusto diferente que limpia el paladar.', 3),
(9, 'Chocolate Artesanal', 70.00, '/Img/Products/Chocolateria/Chocolate Artesanal.webp', 'Elaborado a mano con técnicas tradicionales y cacao de origen ético, nuestro Chocolate Artesanal es una verdadera joya culinaria. Cada pieza refleja la pasión y el cuidado en su proceso, logrando un sabor único que no encontrarás en productos industriales.', 3),
(10, 'Bombones de Chocolate', 62.00, '/Img/Products/Chocolateria/Bombones_de_Chocolate.webp', 'Estos bombones están rellenos con los más deliciosos sabores, desde frutas hasta licores, y cubiertos con una delicada capa de chocolate. Ideales para regalar o disfrutar en momentos especiales, su textura y sabor te conquistarán desde el primer bocado.', 3),
(11, 'Mini Trufas', 40.00, '/Img/Products/Chocolateria/Mini_Trufas.webp', 'Pequeñas pero poderosas, nuestras Mini Trufas ofrecen el mismo sabor y suavidad de una trufa clásica, en un tamaño perfecto para disfrutar sin culpa. Ideales para compartir o como un detalle gourmet.', 3),
(12, 'Chocotejas', 65.00, '/Img/Products/Chocolateria/Chocotejas.webp', 'Desde Perú traemos las auténticas Chocotejas: bombones artesanales rellenos de manjar blanco, frutas confitadas o nueces, cubiertos con una capa gruesa de chocolate oscuro. Una explosión de tradición y sabor en cada pieza.', 3),
(13, 'Chocolate con Fresa', 58.00, '/Img/Products/Chocolateria/Chocolate_con_Fresa.webp', 'Nuestro Chocolate con Fresa combina el dulzor del chocolate con la acidez natural de las fresas liofilizadas. Es una fusión ideal para quienes aman los contrastes suaves y afrutados.', 3),
(14, 'Chocolate con Café', 60.00, '/Img/Products/Chocolateria/Chocolate_con_Cafe.webp', 'Una combinación estimulante y deliciosa. El Chocolate con Café fusiona granos de café tostados con cacao de alta calidad, ofreciendo un sabor intenso, amargo y aromático que encantará a los más cafeteros.', 3),
(15, 'Chocolate con Pistache', 63.00, '/Img/Products/Chocolateria/Chocolate_con_Pistache.webp', 'El sabor tostado y salado del pistache se une al dulzor del chocolate para crear una experiencia crujiente, equilibrada y adictiva. Ideal para los amantes de las nueces y de los sabores gourmet.', 3),
(16, 'Chocolate con Coco', 59.00, '/Img/Products/Chocolateria/Chocolate_con_Coco.webp', 'La combinación del chocolate con la textura y sabor dulce del coco rallado crea una barra cremosa y tropical. Un placer que evoca playas y momentos relajados.', 3),
(17, 'Chocolate Orgánico', 68.00, '/Img/Products/Chocolateria/Chocolate_Organico.webp', 'Elaborado con ingredientes 100% orgánicos, este chocolate es para quienes cuidan su salud y el planeta. Tiene un sabor puro y limpio que refleja la calidad del cacao seleccionado.', 3),
(18, 'Chocolate con Avellanas', 65.00, '/Img/Products/Chocolateria/Chocolate_con_Avellanas.webp', 'El clásico favorito: chocolate suave combinado con trozos crujientes de avellanas tostadas. Ideal para un snack energético y delicioso.', 3),
(19, 'Chocolate de Leche', 50.00, '/Img/Products/Chocolateria/Chocolate_de_Leche.webp', 'Con una textura cremosa y un sabor dulce suave, el Chocolate de Leche es una opción clásica que encanta a grandes y chicos.', 3),
(20, 'Chocolate con Caramelo', 62.00, '/Img/Products/Chocolateria/Chocolate_con_Caramelo.webp', 'Una barra que combina el dulzor del chocolate con un relleno suave y pegajoso de caramelo, ofreciendo un contraste irresistible en cada mordida.', 3),
(66, 'Malvaviscos en Forma de Corazón', 25.00, '/Img/Products/Malvaviscos/Malvaviscos_corazon.webp', 'Inspirados en el amor y la dulzura, los Malvaviscos en Forma de Corazón son una opción encantadora para fechas especiales como San Valentín, aniversarios o cualquier ocasión en la que quieras expresar cariño. Con una textura esponjosa y un sabor delicado, estos malvaviscos no solo deleitan el paladar, sino que también llenan de ternura cualquier mesa. Son ideales para envolver como regalo, decorar cajas de dulces, incluir en desayunos sorpresa o usar en repostería romántica. Su atractivo visual los convierte en una pieza central que roba miradas y corazones por igual.', 5),
(67, 'Malvaviscos Blancos', 50.00, '/Img/Products/Malvaviscos/malvaviscos_blancos.webp', '', 5),
(68, 'Malvaviscos Cítricos', 55.00, '/Img/Products/Malvaviscos/Malvaviscos_Cítricos.webp', '', 5),
(69, 'Malvaviscos con Relleno', 60.00, '/Img/Products/Malvaviscos/Malvaviscos_con_Relleno.webp', '', 5),
(70, 'Malvaviscos Corazón', 65.00, '/Img/Products/Malvaviscos/Malvaviscos_corazon.webp', '', 5),
(71, 'Malvaviscos Cubiertos', 70.00, '/Img/Products/Malvaviscos/Malvaviscos_Cubiertos.webp', '', 5),
(72, 'Malvaviscos de Colores', 55.00, '/Img/Products/Malvaviscos/Malvaviscos_de_Colores.webp', '', 5),
(73, 'Malvaviscos Decorativos', 60.00, '/Img/Products/Malvaviscos/Malvaviscos_Decorativos.webp', '', 5),
(74, 'Malvaviscos Espolvoreados', 50.00, '/Img/Products/Malvaviscos/Malvaviscos_Espolvoreados.webp', '', 5),
(75, 'Malvaviscos Estrella', 55.00, '/Img/Products/Malvaviscos/Malvaviscos_estrella.webp', '', 5),
(76, 'Malvaviscos Fresa', 60.00, '/Img/Products/Malvaviscos/malvaviscos_fresa.webp', '', 5),
(77, 'Malvaviscos Gigantes', 70.00, '/Img/Products/Malvaviscos/Malvaviscos_Gigantes.webp', '', 5),
(78, 'Malvaviscos Surtidos', 65.00, '/Img/Products/Malvaviscos/Malvaviscos_Surtidos.webp', '', 5),
(79, 'Malvaviscos Tostados', 60.00, '/Img/Products/Malvaviscos/Malvaviscos_Tostados.webp', '', 5),
(80, 'Malvaviscos XL', 80.00, '/Img/Products/Malvaviscos/Malvaviscos_XL.webp', '', 5),
(81, 'Bigote', 12.00, '/Img/Products/Panadería/bigote2.webp', '', 4),
(82, 'Bolillo', 5.00, '/Img/Products/Panadería/bolillo.webp', '', 4),
(83, 'Cocol', 10.00, '/Img/Products/Panadería/cocol.webp', '', 4),
(84, 'Concha', 10.00, '/Img/Products/Panadería/concha.webp', '', 4),
(85, 'Cuernito', 10.00, '/Img/Products/Panadería/cuernito.webp', '', 4),
(86, 'Empanada de Piña', 12.00, '/Img/Products/Panadería/empanada de pina.webp', '', 4),
(87, 'Mantecada', 10.00, '/Img/Products/Panadería/MANTECADAS2.webp', '', 4),
(88, 'Orejas', 12.00, '/Img/Products/Panadería/orejas.webp', '', 4),
(89, 'Pan Danés', 14.00, '/Img/Products/Panadería/pan danes.webp', '', 4),
(90, 'Pan de Elote', 15.00, '/Img/Products/Panadería/pan de elote.webp', '', 4),
(91, 'Pan Relleno', 14.00, '/Img/Products/Panadería/pan relleno.webp', '', 4),
(92, 'Pan de Muerto', 15.00, '/Img/Products/Panadería/pan-de-muerto.webp', '', 4),
(93, 'Pan de Queso 2', 14.00, '/Img/Products/Panadería/pandequeso2.webp', '', 4),
(94, 'Pan Integral', 13.00, '/Img/Products/Panadería/panintegral2.webp', '', 4),
(95, 'Panqueso', 14.00, '/Img/Products/Panadería/panqueso.webp', '', 4),
(96, 'Trenza de Chocolate', 16.00, '/Img/Products/Panadería/trenza de chocolate.webp', '', 4),
(97, 'Brownie', 20.00, '/Img/Products/Postres/brownie.webp', '', 1),
(98, 'Cheesecake', 25.00, '/Img/Products/Postres/Cheesecake.webp', '', 1),
(99, 'Churros Rellenos', 18.00, '/Img/Products/Postres/churros-rellenos.webp', '', 1),
(100, 'Cupcake', 15.00, '/Img/Products/Postres/cupcake.webp', '', 1),
(101, 'Mousse de Chocolate', 22.00, '/Img/Products/Postres/El_mousse_de_chocolate.webp', '', 1),
(102, 'Flan Napolitano', 20.00, '/Img/Products/Postres/flannapolitano.webp', '', 1),
(103, 'Galletas Decoradas', 18.00, '/Img/Products/Postres/galletas-decoradas.webp', '', 1),
(104, 'Gelatina', 12.00, '/Img/Products/Postres/gelatina.webp', '', 1),
(105, 'Helado Artesanal', 25.00, '/Img/Products/Postres/Helado Artesanal.webp', '', 1),
(106, 'Pastel de Chocolate', 35.00, '/Img/Products/Postres/Pastel de chocolate.webp', '', 1),
(107, 'Pastel Tres Leches', 38.00, '/Img/Products/Postres/pastel_TRES_LECHES.webp', '', 1),
(108, 'Pastel de Zanahoria', 35.00, '/Img/Products/Postres/Pastel-De-Zanahoria.webp', '', 1),
(109, 'Pay de Limón', 30.00, '/Img/Products/Postres/PayDeLimon.webp', '', 1),
(110, 'Tiramisú', 32.00, '/Img/Products/Postres/Tiramisu.webp', '', 1),
(111, 'Torta de Frutas', 36.00, '/Img/Products/Postres/TortaDeFrutas.webp', '', 1),
(112, 'Caramelo Surtido', 10.00, '/Img/Products/Dulces/Caramelo-surtido.webp', '', 2),
(113, 'Caramelos Relleno', 12.00, '/Img/Products/Dulces/caramelos-relleno.webp', '', 2),
(114, 'Chicles', 8.00, '/Img/Products/Dulces/chicles.webp', '', 2),
(115, 'Dulce de Leche', 10.00, '/Img/Products/Dulces/dulce_de_leche.webp', '', 2),
(116, 'Dulces Picantes', 10.00, '/Img/Products/Dulces/Dulces_Picantes.webp', '', 2),
(117, 'Dulces Ácidos', 9.00, '/Img/Products/Dulces/dulces-acidos.webp', '', 2),
(118, 'Dulces de Menta', 8.00, '/Img/Products/Dulces/dulces-menta.webp', '', 2),
(119, 'Duvalín', 6.00, '/Img/Products/Dulces/duvalin.webp', '', 2),
(120, 'Gomitas Ácidas', 10.00, '/Img/Products/Dulces/gomitas-acidas.webp', '', 2),
(121, 'Gomitas de Fruta', 10.00, '/Img/Products/Dulces/Gomitas-de-Fruta.webp', '', 2),
(122, 'Mazapán', 7.00, '/Img/Products/Dulces/mazapan.webp', '', 2),
(123, 'Paletas de Sabores', 9.00, '/Img/Products/Dulces/paletas_de_sabores.webp', '', 2),
(124, 'Pulparindo', 6.00, '/Img/Products/Dulces/Pulparindo.webp', '', 2),
(125, 'Rollitos de Fruta', 8.00, '/Img/Products/Dulces/rollitos_de_fruta.webp', '', 2),
(126, 'Tamarindo Picante', 10.00, '/Img/Products/Dulces/Tamarindo-Picante.webp', '', 2),
(129, 'hola', 0.03, 'jnsxkcsn', 'knkcnklscbiuscabsc', 3),
(130, 'prueba', 0.04, 'jnskncs', 'knsknsc', 3),
(132, 'PRUEBITA JEJE', 0.05, 'https://mx.images.search.yahoo.com/images/view;_ylt=AwrFPfFHHH9oDjcF5uPF8Qt.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2U1NjZiZWU2MmMxNWI1ZDNhNzJlNmI5MjJmOTI1ZWNmBGdwb3MDMgRpdANiaW5n?back=https%3A%2F%2Fmx.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dimagen%2Bde%2B', 'holiAAJKSX', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'empleado'),
(3, 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `almacen_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock`
--

INSERT INTO `stock` (`id`, `producto_id`, `almacen_id`, `cantidad`, `fecha_actualizacion`) VALUES
(1, 132, 1, 23, '2025-07-22 06:15:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `perfil` varchar(255) DEFAULT '/default-profile.png',
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `last_name`, `email`, `password`, `created_at`, `perfil`, `role_id`) VALUES
(1, 'TestUser', 'Apellido', 'test@example.com', '$2b$10$xuLr0rkZLWx0ZC4WLzXu9.f3stxWIWRzQs1JYY/C4fCJaRU0kxJcm', '2025-06-26 15:02:45', '/default-profile.png', 3),
(3, 'Humbert', 'Humberto', 'humberto@humberto.com', '$2b$10$iWyYrlhy1Os7tu438XaA3uNPjcHrIdRR574ZpZA0mLGzDu16h20Jm', '2025-06-26 15:23:30', '/default-profile.png', 3),
(13, 'TestUser', 'Last', 'empleado@empleado.com', 'hashedpass', '2025-07-07 14:41:23', '/default-profile.png', 2),
(14, 'Hola', 'Empleado', 'a@empleado.com', '$2b$10$f9ZcSGXdgLFxIt0Uac.uG.K8af59Y1v1g1cY7wCxYdtscZnbO5eha', '2025-07-07 14:43:17', '/default-profile.png', 2),
(15, 'Hola', 'Holi', 'a2@empleado.com', '$2b$10$DzGI8ds9EZDOboBT/UH0hust9gZITOsIRhOJwOhRmltdHJ8O7ILfq', '2025-07-07 14:47:29', '/default-profile.png', 2),
(16, 'Admin', 'Admin', 'admin@admin.com', '$2b$10$LKaLtssu.aKDQkX741BUTue8SV4i0rGnZ/Dyr9daJ35N2G536Lg8W', '2025-07-13 03:03:27', '/default-profile.png', 1),
(21, 'prueba', '12', '12@12.com', '$2b$10$KnpBJ760IazANwkBe1lsaeJJatNLdGv.Db8MHPQI/rDPgmXOGEwb6', '2025-07-16 13:41:12', '/default-profile.png', 3),
(22, 'prueba', 'prueba', 'pruebaa@prueba.com', '$2b$10$kFFPaCwRAfov2K5hekzCouX7j7CJFiWWKN9Y6DYg9TCHdBH6FS20a', '2025-07-16 13:46:44', '/default-profile.png', 3),
(23, 'PPPPPP', NULL, 'p@a.com', '$2b$10$bcqPKpWaQrkNtNlqQuRux.9dzJhg/u16j2zpmwVBJ/CmsCXW/1o9S', '2025-07-16 14:03:19', '/default-profile.png', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacenes`
--
ALTER TABLE `almacenes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `direccion_id` (`direccion_id`),
  ADD KEY `metodo_pago_id` (`metodo_pago_id`);

--
-- Indices de la tabla `orden_productos`
--
ALTER TABLE `orden_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_categoria` (`categoria_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `almacen_id` (`almacen_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacenes`
--
ALTER TABLE `almacenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `orden_productos`
--
ALTER TABLE `orden_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD CONSTRAINT `metodos_pago_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `ordenes_ibfk_2` FOREIGN KEY (`direccion_id`) REFERENCES `direcciones` (`id`),
  ADD CONSTRAINT `ordenes_ibfk_3` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`);

--
-- Filtros para la tabla `orden_productos`
--
ALTER TABLE `orden_productos`
  ADD CONSTRAINT `orden_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`almacen_id`) REFERENCES `almacenes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
