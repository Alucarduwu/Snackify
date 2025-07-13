export interface Producto {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

const productsData: Producto[] = [
  {
    id: 1,
    name: 'Chocolate Amargo',
    category: 'Chocolatería',
    price: 50,
    image: '/Img/Products/Chocolateria/Chocolate_Amargo.webp',
    description: 'Nuestro Chocolate Amargo es una delicia intensa elaborada con un alto porcentaje de cacao puro, ideal para los verdaderos amantes del chocolate. Su sabor profundo, con notas sutiles de frutos secos y una textura firme que se derrite lentamente en el paladar, lo convierte en la elección perfecta para quienes buscan una experiencia sensorial sofisticada y sin azúcares añadidos.'
  },
  {
    id: 2,
    name: 'Trufas Clásicas',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Trufas_Clasicas.webp',
    description: 'Las Trufas Clásicas son pequeñas obras maestras hechas a mano con una mezcla perfecta de ganache suave y cobertura de chocolate amargo espolvoreada con cacao en polvo. Cada bocado es una explosión de sabor cremoso y profundo, que ofrece una experiencia de lujo para los sentidos. Perfectas para regalar o para disfrutar en un momento de indulgencia personal.'
  },
  {
    id: 3,
    name: 'Tableta de Cacao 70%',
    category: 'Chocolatería',
    price: 45,
    image: '/Img/Products/Chocolateria/Tableta-de-Cacao.webp',
    description: 'La Tableta de Cacao 70% es un equilibrio perfecto entre amargor y dulzura, ideal para quienes buscan una experiencia auténtica del cacao. Con ingredientes seleccionados de origen sostenible, esta tableta es rica en antioxidantes, con un aroma profundo y una textura suave que se funde delicadamente en la boca.'
  },
  {
    id: 4,
    name: 'Chocolate con Almendras',
    category: 'Chocolatería',
    price: 55,
    image: '/Img/Products/Chocolateria/Chocolate-con-Almendras.webp',
    description: 'Disfruta de la combinación perfecta entre el sabor del chocolate oscuro y la textura crujiente de almendras tostadas. Esta barra está elaborada con ingredientes de alta calidad y ofrece un contraste delicioso que deleita a cualquier paladar. Un clásico que nunca falla.'
  },
  {
    id: 5,
    name: 'Barras Rellenas',
    category: 'Chocolatería',
    price: 48,
    image: '/Img/Products/Chocolateria/Barras Rellenas.webp',
    description: 'Nuestras Barras Rellenas son una experiencia multisensorial: una capa exterior de chocolate liso y brillante que envuelve un corazón suave y cremoso. Disponibles en una variedad de sabores como avellana, caramelo o fresa, son perfectas para quienes buscan algo más que una barra común.'
  },
  {
    id: 6,
    name: 'Chocolate Blanco',
    category: 'Chocolatería',
    price: 52,
    image: '/Img/Products/Chocolateria/Chocolate_Blanco.webp',
    description: 'El Chocolate Blanco es una delicia cremosa y suave, con un toque de vainilla natural que resalta su dulzura característica. Elaborado con manteca de cacao de alta pureza, este chocolate ofrece una textura sedosa ideal para los más golosos.'
  },
  {
    id: 7,
    name: 'Chocolate con Naranja',
    category: 'Chocolatería',
    price: 53,
    image: '/Img/Products/Chocolateria/Chocolate con naranja.webp',
    description: 'Esta barra combina el intenso sabor del chocolate oscuro con la frescura cítrica de la naranja. El resultado es un equilibrio elegante entre dulzura y acidez, ideal para quienes buscan una experiencia diferente y sofisticada en cada mordida.'
  },
  {
    id: 8,
    name: 'Chocolate con Menta',
    category: 'Chocolatería',
    price: 50,
    image: '/Img/Products/Chocolateria/Chocomenta.webp',
    description: 'Nuestro Chocolate con Menta ofrece una sensación refrescante única, combinando el profundo sabor del chocolate oscuro con la frescura natural de la menta. Perfecto como digestivo o simplemente para disfrutar de un gusto diferente que limpia el paladar.'
  },
  {
    id: 9,
    name: 'Chocolate Artesanal',
    category: 'Chocolatería',
    price: 70,
    image: '/Img/Products/Chocolateria/Chocolate Artesanal.webp',
    description: 'Elaborado a mano con técnicas tradicionales y cacao de origen ético, nuestro Chocolate Artesanal es una verdadera joya culinaria. Cada pieza refleja la pasión y el cuidado en su proceso, logrando un sabor único que no encontrarás en productos industriales.'
  },
  {
    id: 10,
    name: 'Bombones de Chocolate',
    category: 'Chocolatería',
    price: 62,
    image: '/Img/Products/Chocolateria/Bombones_de_Chocolate.webp',
    description: 'Estos bombones están rellenos con los más deliciosos sabores, desde frutas hasta licores, y cubiertos con una delicada capa de chocolate. Ideales para regalar o disfrutar en momentos especiales, su textura y sabor te conquistarán desde el primer bocado.'
  },
  {
    id: 11,
    name: 'Mini Trufas',
    category: 'Chocolatería',
    price: 40,
    image: '/Img/Products/Chocolateria/Mini_Trufas.webp',
    description: 'Pequeñas pero poderosas, nuestras Mini Trufas ofrecen el mismo sabor y suavidad de una trufa clásica, en un tamaño perfecto para disfrutar sin culpa. Ideales para compartir o como un detalle gourmet.'
  },
  {
    id: 12,
    name: 'Chocotejas',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocotejas.webp',
    description: 'Desde Perú traemos las auténticas Chocotejas: bombones artesanales rellenos de manjar blanco, frutas confitadas o nueces, cubiertos con una capa gruesa de chocolate oscuro. Una explosión de tradición y sabor en cada pieza.'
  },
  {
    id: 13,
    name: 'Chocolate con Fresa',
    category: 'Chocolatería',
    price: 58,
    image: '/Img/Products/Chocolateria/Chocolate_con_Fresa.webp',
    description: 'Nuestro Chocolate con Fresa combina el dulzor del chocolate con la acidez natural de las fresas liofilizadas. Es una fusión ideal para quienes aman los contrastes suaves y afrutados.'
  },
  {
    id: 14,
    name: 'Chocolate con Café',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Chocolate_con_Cafe.webp',
    description: 'Una combinación estimulante y deliciosa. El Chocolate con Café fusiona granos de café tostados con cacao de alta calidad, ofreciendo un sabor intenso, amargo y aromático que encantará a los más cafeteros.'
  },
  {
    id: 15,
    name: 'Chocolate con Pistache',
    category: 'Chocolatería',
    price: 63,
    image: '/Img/Products/Chocolateria/Chocolate_con_Pistache.webp',
    description: 'El sabor tostado y salado del pistache se une al dulzor del chocolate para crear una experiencia crujiente, equilibrada y adictiva. Ideal para los amantes de las nueces y de los sabores gourmet.'
  },
  {
    id: 16,
    name: 'Chocolate con Coco',
    category: 'Chocolatería',
    price: 59,
    image: '/Img/Products/Chocolateria/Chocolate_con_Coco.webp',
    description: 'La combinación del chocolate con la textura y sabor dulce del coco rallado crea una barra cremosa y tropical. Un placer que evoca playas y momentos relajados.'
  },
  {
    id: 17,
    name: 'Chocolate Orgánico',
    category: 'Chocolatería',
    price: 68,
    image: '/Img/Products/Chocolateria/Chocolate_Organico.webp',
    description: 'Elaborado con ingredientes 100% orgánicos, este chocolate es para quienes cuidan su salud y el planeta. Tiene un sabor puro y limpio que refleja la calidad del cacao seleccionado.'
  },
  {
    id: 18,
    name: 'Chocolate con Avellanas',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocolate_con_Avellanas.webp',
    description: 'El clásico favorito: chocolate suave combinado con trozos crujientes de avellanas tostadas. Ideal para un snack energético y delicioso.'
  },
  {
    id: 19,
    name: 'Chocolate de Leche',
    category: 'Chocolatería',
    price: 50,
    image: '/Img/Products/Chocolateria/Chocolate_de_Leche.webp',
    description: 'Con una textura cremosa y un sabor dulce suave, el Chocolate de Leche es una opción clásica que encanta a grandes y chicos.'
  },
  {
    id: 20,
    name: 'Chocolate con Caramelo',
    category: 'Chocolatería',
    price: 62,
    image: '/Img/Products/Chocolateria/Chocolate_con_Caramelo.webp',
    description: 'Una barra que combina el dulzor del chocolate con un relleno suave y pegajoso de caramelo, ofreciendo un contraste irresistible en cada mordida.'
  },
  {
    id: 21,
    name: 'Chocolate con Chiles',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocolate_con_Chiles.webp',
    description: 'Para los que gustan de sabores intensos, el chocolate con chiles ofrece una mezcla picante y dulce, con un toque ahumado que sorprende.'
  },
  {
    id: 22,
    name: 'Tableta de Chocolate con Sal Marina',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Tableta_Chocolate_Sal_Marina.webp',
    description: 'El contraste entre el chocolate dulce y la sal marina aporta una experiencia gourmet que realza los sabores y genera un sabor más complejo.'
  },
  {
    id: 23,
    name: 'Chocolate con Almendra y Nuez',
    category: 'Chocolatería',
    price: 67,
    image: '/Img/Products/Chocolateria/Chocolate_Almendra_Nuez.webp',
    description: 'Una mezcla perfecta de frutos secos como almendra y nuez con chocolate suave, ideal para quienes buscan un snack nutritivo y delicioso.'
  },
  {
    id: 24,
    name: 'Tableta de Chocolate con Miel',
    category: 'Chocolatería',
    price: 58,
    image: '/Img/Products/Chocolateria/Tableta_Chocolate_Miel.webp',
    description: 'El dulzor natural de la miel se integra perfectamente con el chocolate, aportando notas florales y una textura ligeramente pegajosa.'
  },
  {
    id: 25,
    name: 'Chocolate con Frambuesa',
    category: 'Chocolatería',
    price: 62,
    image: '/Img/Products/Chocolateria/Chocolate_Frambuesa.webp',
    description: 'Esta barra combina la acidez de las frambuesas liofilizadas con la suavidad del chocolate oscuro, ofreciendo un equilibrio refrescante y elegante.'
  },
  {
    id: 26,
    name: 'Chocolate Negro Intenso',
    category: 'Chocolatería',
    price: 70,
    image: '/Img/Products/Chocolateria/Chocolate_Negro_Intenso.webp',
    description: 'Para los amantes del cacao puro, este chocolate tiene un alto porcentaje de cacao (85%) y un sabor fuerte, amargo y lleno de matices.'
  },
  {
    id: 27,
    name: 'Chocolate con Caramelo Salado',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocolate_Caramelo_Salado.webp',
    description: 'Una delicia que une la dulzura del caramelo con un toque de sal marina para potenciar el sabor y dar una textura cremosa irresistible.'
  },
  {
    id: 28,
    name: 'Chocolate con Semillas de Calabaza',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Chocolate_Semillas_Calabaza.webp',
    description: 'Una barra nutritiva y diferente que combina chocolate y semillas de calabaza tostadas, aportando un crujido natural y sabor único.'
  },
  {
    id: 29,
    name: 'Chocolate con Jengibre',
    category: 'Chocolatería',
    price: 63,
    image: '/Img/Products/Chocolateria/Chocolate_Jengibre.webp',
    description: 'El picante y aroma del jengibre fresco fusionado con chocolate oscuro crea una barra exótica y estimulante para el paladar.'
  },
  {
    id: 30,
    name: 'Chocolate con Canela',
    category: 'Chocolatería',
    price: 58,
    image: '/Img/Products/Chocolateria/Chocolate_Canela.webp',
    description: 'La calidez y aroma de la canela complementan el sabor del chocolate, ofreciendo una barra ideal para momentos reconfortantes.'
  },
  {
    id: 31,
    name: 'Chocolate con Naranja',
    category: 'Chocolatería',
    price: 62,
    image: '/Img/Products/Chocolateria/Chocolate_Naranja.webp',
    description: 'La frescura y acidez de la naranja combinan perfectamente con la suavidad del chocolate para crear una experiencia cítrica y dulce.'
  },
  {
    id: 32,
    name: 'Chocolate Blanco con Frutos Rojos',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocolate_Blanco_Frutos_Rojos.webp',
    description: 'El chocolate blanco dulce se enriquece con la acidez y textura de frutos rojos deshidratados, para un contraste delicioso y sofisticado.'
  },
  {
    id: 33,
    name: 'Chocolate con Menta',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Chocolate_Menta.webp',
    description: 'Una barra refrescante donde la menta aporta un toque fresco y herbal que complementa muy bien el sabor dulce del chocolate.'
  },
  {
    id: 34,
    name: 'Chocolate con Café',
    category: 'Chocolatería',
    price: 68,
    image: '/Img/Products/Chocolateria/Chocolate_Cafe.webp',
    description: 'La combinación de chocolate y café intenso crea un sabor profundo y complejo, ideal para los amantes del buen espresso y los dulces.'
  },
  {
    id: 35,
    name: 'Chocolate con Almendra',
    category: 'Chocolatería',
    price: 63,
    image: '/Img/Products/Chocolateria/Chocolate_Almendra.webp',
    description: 'Trozos crujientes de almendra tostada se mezclan con chocolate cremoso para un snack nutritivo y delicioso.'
  },
  {
    id: 36,
    name: 'Chocolate con Avellana Entera',
    category: 'Chocolatería',
    price: 70,
    image: '/Img/Products/Chocolateria/Chocolate_Avellana_Entera.webp',
    description: 'Para los que buscan una experiencia completa, esta barra tiene avellanas enteras en su interior para un sabor intenso y textura crocante.'
  },
  {
    id: 37,
    name: 'Chocolate con Coco Rallado',
    category: 'Chocolatería',
    price: 60,
    image: '/Img/Products/Chocolateria/Chocolate_Coco_Rallado.webp',
    description: 'La suavidad del chocolate combinada con el aroma y sabor del coco rallado que aporta un toque tropical irresistible.'
  },
  {
    id: 38,
    name: 'Chocolate con Pistache',
    category: 'Chocolatería',
    price: 72,
    image: '/Img/Products/Chocolateria/Chocolate_Pistache.webp',
    description: 'Una barra elegante que mezcla el chocolate fino con trozos crujientes de pistache para un sabor exótico y sofisticado.'
  },
  {
    id: 39,
    name: 'Chocolate con Arándanos',
    category: 'Chocolatería',
    price: 65,
    image: '/Img/Products/Chocolateria/Chocolate_Arandanos.webp',
    description: 'El sabor ácido y dulce de los arándanos secos combina perfectamente con el chocolate, ofreciendo un bocado fresco y frutal.'
  },
  {
    id: 40,
    name: 'Chocolate con Cardamomo',
    category: 'Chocolatería',
    price: 68,
    image: '/Img/Products/Chocolateria/Chocolate_Cardamomo.webp',
    description: 'Una mezcla exótica donde el cardamomo aporta un aroma intenso y especiado que resalta el sabor del chocolate oscuro.'
  },
  {
    id: 41,
    name: 'Chocolate con Avellana y Miel',
    category: 'Chocolatería',
    price: 70,
    image: '/Img/Products/Chocolateria/Chocolate_Avellana_Miel.webp',
    description: 'La dulzura natural de la miel junto con trozos de avellana crea una barra dulce, crujiente y suave a la vez.'
  },
  {
    id: 42,
    name: 'Chocolate con Almendra y Sal',
    category: 'Chocolatería',
    price: 67,
    image: '/Img/Products/Chocolateria/Chocolate_Almendra_Sal.webp',
    description: 'El contraste entre la almendra tostada y un toque de sal marina en el chocolate crea un sabor equilibrado y memorable.'
  },
  {
    id: 43,
    name: 'Chocolate con Nibs de Cacao',
    category: 'Chocolatería',
    price: 72,
    image: '/Img/Products/Chocolateria/Chocolate_Nibs_Cacao.webp',
    description: 'Para los que buscan el sabor más puro, esta barra contiene nibs de cacao que aportan textura y un sabor intenso y amargo.'
  },
  {
    id: 44,
    name: 'Chocolate con Frambuesa y Almendra',
    category: 'Chocolatería',
    price: 70,
    image: '/Img/Products/Chocolateria/Chocolate_Frambuesa_Almendra.webp',
    description: 'La acidez de la frambuesa combinada con la crocancia de la almendra en una barra de chocolate dulce y equilibrada.'
  },
  {
    id: 45,
    name: 'Chocolate con Té Verde Matcha',
    category: 'Chocolatería',
    price: 75,
    image: '/Img/Products/Chocolateria/Chocolate_Te_Verde_Matcha.webp',
    description: 'Una barra innovadora que mezcla el chocolate blanco con el sabor herbáceo y delicado del té verde matcha.'
  },
  {
    id: 46,
    name: 'Galletas de Avena y Miel',
    category: 'Galletas',
    price: 48,
    image: '/Img/Products/Galletas/Galletas_Avena_Miel.webp',
    description: 'Galletas crujientes y nutritivas elaboradas con avena integral y un toque dulce de miel natural.'
  },
  {
    id: 47,
    name: 'Galletas de Chocolate con Chips',
    category: 'Galletas',
    price: 52,
    image: '/Img/Products/Galletas/Galletas_Chocolate_Chips.webp',
    description: 'Clásicas galletas suaves con abundantes trozos de chocolate para los amantes del dulce.'
  },
  {
    id: 48,
    name: 'Galletas de Almendra',
    category: 'Galletas',
    price: 55,
    image: '/Img/Products/Galletas/Galletas_Almendra.webp',
    description: 'Galletas delicadas con sabor a almendra tostada, perfectas para acompañar el café.'
  },
  {
    id: 49,
    name: 'Galletas Integrales con Semillas',
    category: 'Galletas',
    price: 50,
    image: '/Img/Products/Galletas/Galletas_Integrales_Semillas.webp',
    description: 'Una opción saludable con harina integral y una mezcla de semillas para un extra de fibra y textura.'
  },
  {
    id: 50,
    name: 'Galletas de Coco',
    category: 'Galletas',
    price: 48,
    image: '/Img/Products/Galletas/Galletas_Coco.webp',
    description: 'Crujientes galletas con un intenso sabor a coco rallado, ideales para los amantes del sabor tropical.'
  },
  {
    id: 51,
    name: 'Galletas de Jengibre',
    category: 'Galletas',
    price: 50,
    image: '/Img/Products/Galletas/Galletas_Jengibre.webp',
    description: 'Galletas especiadas con jengibre, perfectas para temporada de frío o para quienes gustan de sabores intensos.'
  },
  {
    id: 52,
    name: 'Galletas de Vainilla',
    category: 'Galletas',
    price: 45,
    image: '/Img/Products/Galletas/Galletas_Vainilla.webp',
    description: 'Galletas suaves con un delicado sabor a vainilla, perfectas para cualquier momento del día.'
  },
  {
    id: 53,
    name: 'Galletas de Nuez',
    category: 'Galletas',
    price: 55,
    image: '/Img/Products/Galletas/Galletas_Nuez.webp',
    description: 'Galletas con trozos de nuez que aportan un sabor tostado y textura crocante.'
  },
  {
    id: 54,
    name: 'Galletas de Limón',
    category: 'Galletas',
    price: 48,
    image: '/Img/Products/Galletas/Galletas_Limon.webp',
    description: 'Galletas con un toque cítrico de limón que las hace frescas y deliciosas.'
  },
  {
    id: 55,
    name: 'Galletas de Canela',
    category: 'Galletas',
    price: 47,
    image: '/Img/Products/Galletas/Galletas_Canela.webp',
    description: 'Galletas aromáticas con sabor a canela, ideales para acompañar bebidas calientes.'
  },
  {
    id: 56,
    name: 'Galletas de Chocolate Blanco y Arándanos',
    category: 'Galletas',
    price: 60,
    image: '/Img/Products/Galletas/Galletas_Chocolate_Blanco_Arandanos.webp',
    description: 'Galletas suaves que combinan chocolate blanco cremoso y arándanos deshidratados para un sabor frutal y dulce.'
  },
  {
    id: 57,
    name: 'Galletas de Mantequilla',
    category: 'Galletas',
    price: 45,
    image: '/Img/Products/Galletas/Galletas_Mantequilla.webp',
    description: 'Clásicas galletas con un rico sabor a mantequilla, ideales para toda ocasión.'
  },
  {
    id: 58,
    name: 'Galletas de Avellana y Chocolate',
    category: 'Galletas',
    price: 58,
    image: '/Img/Products/Galletas/Galletas_Avellana_Chocolate.webp',
    description: 'Galletas que combinan trozos de avellana con chocolate para una experiencia dulce y crocante.'
  },
  {
    id: 59,
    name: 'Galletas de Miel y Nuez',
    category: 'Galletas',
    price: 57,
    image: '/Img/Products/Galletas/Galletas_Miel_Nuez.webp',
    description: 'Una deliciosa mezcla de miel y nueces en una galleta suave y aromática.'
  },
  {
    id: 60,
    name: 'Galletas Veganas de Chocolate',
    category: 'Galletas',
    price: 60,
    image: '/Img/Products/Galletas/Galletas_Veganas_Chocolate.webp',
    description: 'Galletas veganas elaboradas con ingredientes naturales y trozos de chocolate amargo.'
  },
  {
    id: 61,
    name: 'Galletas Sin Gluten de Avena',
    category: 'Galletas',
    price: 65,
    image: '/Img/Products/Galletas/Galletas_Sin_Gluten_Avena.webp',
    description: 'Galletas saludables sin gluten hechas con avena certificada para personas con intolerancias.'
  },
  {
    id: 62,
    name: 'Galletas de Almendra y Chocolate',
    category: 'Galletas',
    price: 62,
    image: '/Img/Products/Galletas/Galletas_Almendra_Chocolate.webp',
    description: 'Crujientes galletas con almendra tostada y trozos de chocolate semi-amargo.'
  },
  {
    id: 63,
    name: 'Galletas de Nuez y Canela',
    category: 'Galletas',
    price: 60,
    image: '/Img/Products/Galletas/Galletas_Nuez_Canela.webp',
    description: 'Galletas especiadas con canela y trozos de nuez que aportan textura y sabor cálido.'
  },
  {
    id: 64,
    name: 'Galletas de Avena con Pasas',
    category: 'Galletas',
    price: 55,
    image: '/Img/Products/Galletas/Galletas_Avena_Pasas.webp',
    description: 'Clásicas galletas de avena con dulces pasas naturales, ideales para un snack saludable.'
  },
  {
    id: 65,
    name: 'Galletas de Chocolate con Menta',
    category: 'Galletas',
    price: 63,
    image: '/Img/Products/Galletas/Galletas_Chocolate_Menta.webp',
    description: 'Galletas con sabor refrescante a menta y trozos de chocolate oscuro.'
  },
  {
    id: 66,
    name: 'Malvaviscos en Forma de Corazón',
    category: 'Malvaviscos',
    price: 25,
    image: '/Img/Products/Malvaviscos/Malvaviscos_corazon.webp',
    description:
      'Inspirados en el amor y la dulzura, los Malvaviscos en Forma de Corazón son una opción encantadora para fechas especiales como San Valentín, aniversarios o cualquier ocasión en la que quieras expresar cariño. Con una textura esponjosa y un sabor delicado, estos malvaviscos no solo deleitan el paladar, sino que también llenan de ternura cualquier mesa. Son ideales para envolver como regalo, decorar cajas de dulces, incluir en desayunos sorpresa o usar en repostería romántica. Su atractivo visual los convierte en una pieza central que roba miradas y corazones por igual.',
  },
  {
    id: 67,
    name: 'Malvaviscos Blancos',
    category: 'Malvaviscos',
    price: 50,
    image: '/Img/Products/Malvaviscos/malvaviscos_blancos.webp',
    description: '',
  },
  {
    id: 68,
    name: 'Malvaviscos Cítricos',
    category: 'Malvaviscos',
    price: 55,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Cítricos.webp',
    description: '',
  },
  {
    id: 69,
    name: 'Malvaviscos con Relleno',
    category: 'Malvaviscos',
    price: 60,
    image: '/Img/Products/Malvaviscos/Malvaviscos_con_Relleno.webp',
    description: '',
  },
  {
    id: 70,
    name: 'Malvaviscos Corazón',
    category: 'Malvaviscos',
    price: 65,
    image: '/Img/Products/Malvaviscos/Malvaviscos_corazon.webp',
    description: '',
  },
  {
    id: 71,
    name: 'Malvaviscos Cubiertos',
    category: 'Malvaviscos',
    price: 70,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Cubiertos.webp',
    description: '',
  },
  {
    id: 72,
    name: 'Malvaviscos de Colores',
    category: 'Malvaviscos',
    price: 55,
    image: '/Img/Products/Malvaviscos/Malvaviscos_de_Colores.webp',
    description: '',
  },
  {
    id: 73,
    name: 'Malvaviscos Decorativos',
    category: 'Malvaviscos',
    price: 60,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Decorativos.webp',
    description: '',
  },
  {
    id: 74,
    name: 'Malvaviscos Espolvoreados',
    category: 'Malvaviscos',
    price: 50,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Espolvoreados.webp',
    description: '',
  },
  {
    id: 75,
    name: 'Malvaviscos Estrella',
    category: 'Malvaviscos',
    price: 55,
    image: '/Img/Products/Malvaviscos/Malvaviscos_estrella.webp',
    description: '',
  },
  {
    id: 76,
    name: 'Malvaviscos Fresa',
    category: 'Malvaviscos',
    price: 60,
    image: '/Img/Products/Malvaviscos/malvaviscos_fresa.webp',
    description: '',
  },
  {
    id: 77,
    name: 'Malvaviscos Gigantes',
    category: 'Malvaviscos',
    price: 70,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Gigantes.webp',
    description: '',
  },
  {
    id: 78,
    name: 'Malvaviscos Surtidos',
    category: 'Malvaviscos',
    price: 65,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Surtidos.webp',
    description: '',
  },
  {
    id: 79,
    name: 'Malvaviscos Tostados',
    category: 'Malvaviscos',
    price: 60,
    image: '/Img/Products/Malvaviscos/Malvaviscos_Tostados.webp',
    description: '',
  },
  {
    id: 80,
    name: 'Malvaviscos XL',
    category: 'Malvaviscos',
    price: 80,
    image: '/Img/Products/Malvaviscos/Malvaviscos_XL.webp',
    description: '',
  },
{
    id: 81,
    name: 'Bigote',
    category: 'Panadería',
    price: 12,
    image: '/Img/Products/Panadería/bigote2.webp',
    description: '',
  },
  {
    id: 82,
    name: 'Bolillo',
    category: 'Panadería',
    price: 5,
    image: '/Img/Products/Panadería/bolillo.webp',
    description: '',
  },
  {
    id: 83,
    name: 'Cocol',
    category: 'Panadería',
    price: 10,
    image: '/Img/Products/Panadería/cocol.webp',
    description: '',
  },
  {
    id: 84,
    name: 'Concha',
    category: 'Panadería',
    price: 10,
    image: '/Img/Products/Panadería/concha.webp',
    description: '',
  },
  {
    id: 85,
    name: 'Cuernito',
    category: 'Panadería',
    price: 10,
    image: '/Img/Products/Panadería/cuernito.webp',
    description: '',
  },
  {
    id: 86,
    name: 'Empanada de Piña',
    category: 'Panadería',
    price: 12,
    image: '/Img/Products/Panadería/empanada de pina.webp',
    description: '',
  },
  {
    id: 87,
    name: 'Mantecada',
    category: 'Panadería',
    price: 10,
    image: '/Img/Products/Panadería/MANTECADAS2.webp',
    description: '',
  },
  {
    id: 88,
    name: 'Orejas',
    category: 'Panadería',
    price: 12,
    image: '/Img/Products/Panadería/orejas.webp',
    description: '',
  },
  {
    id: 89,
    name: 'Pan Danés',
    category: 'Panadería',
    price: 14,
    image: '/Img/Products/Panadería/pan danes.webp',
    description: '',
  },
  {
    id: 90,
    name: 'Pan de Elote',
    category: 'Panadería',
    price: 15,
    image: '/Img/Products/Panadería/pan de elote.webp',
    description: '',
  },
  {
    id: 91,
    name: 'Pan Relleno',
    category: 'Panadería',
    price: 14,
    image: '/Img/Products/Panadería/pan relleno.webp',
    description: '',
  },
  {
    id: 92,
    name: 'Pan de Muerto',
    category: 'Panadería',
    price: 15,
    image: '/Img/Products/Panadería/pan-de-muerto.webp',
    description: '',
  },
  {
    id: 93,
    name: 'Pan de Queso 2',
    category: 'Panadería',
    price: 14,
    image: '/Img/Products/Panadería/pandequeso2.webp',
    description: '',
  },
  {
    id: 94,
    name: 'Pan Integral',
    category: 'Panadería',
    price: 13,
    image: '/Img/Products/Panadería/panintegral2.webp',
    description: '',
  },
  {
    id: 95,
    name: 'Panqueso',
    category: 'Panadería',
    price: 14,
    image: '/Img/Products/Panadería/panqueso.webp',
    description: '',
  },
  {
    id: 96,
    name: 'Trenza de Chocolate',
    category: 'Panadería',
    price: 16,
    image: '/Img/Products/Panadería/trenza de chocolate.webp',
    description: '',
  },
{
    id: 97,
    name: 'Brownie',
    category: 'Postres',
    price: 20,
    image: '/Img/Products/Postres/brownie.webp',
    description: '',
  },
  {
    id: 98,
    name: 'Cheesecake',
    category: 'Postres',
    price: 25,
    image: '/Img/Products/Postres/Cheesecake.webp',
    description: '',
  },
  {
    id: 99,
    name: 'Churros Rellenos',
    category: 'Postres',
    price: 18,
    image: '/Img/Products/Postres/churros-rellenos.webp',
    description: '',
  },
  {
    id: 100,
    name: 'Cupcake',
    category: 'Postres',
    price: 15,
    image: '/Img/Products/Postres/cupcake.webp',
    description: '',
  },
  {
    id: 101,
    name: 'Mousse de Chocolate',
    category: 'Postres',
    price: 22,
    image: '/Img/Products/Postres/El_mousse_de_chocolate.webp',
    description: '',
  },
  {
    id: 102,
    name: 'Flan Napolitano',
    category: 'Postres',
    price: 20,
    image: '/Img/Products/Postres/flannapolitano.webp',
    description: '',
  },
  {
    id: 103,
    name: 'Galletas Decoradas',
    category: 'Postres',
    price: 18,
    image: '/Img/Products/Postres/galletas-decoradas.webp',
    description: '',
  },
  {
    id: 104,
    name: 'Gelatina',
    category: 'Postres',
    price: 12,
    image: '/Img/Products/Postres/gelatina.webp',
    description: '',
  },
  {
    id: 105,
    name: 'Helado Artesanal',
    category: 'Postres',
    price: 25,
    image: '/Img/Products/Postres/Helado Artesanal.webp',
    description: '',
  },
  {
    id: 106,
    name: 'Pastel de Chocolate',
    category: 'Postres',
    price: 35,
    image: '/Img/Products/Postres/Pastel de chocolate.webp',
    description: '',
  },
  {
    id: 107,
    name: 'Pastel Tres Leches',
    category: 'Postres',
    price: 38,
    image: '/Img/Products/Postres/pastel_TRES_LECHES.webp',
    description: '',
  },
  {
    id: 108,
    name: 'Pastel de Zanahoria',
    category: 'Postres',
    price: 35,
    image: '/Img/Products/Postres/Pastel-De-Zanahoria.webp',
    description: '',
  },
  {
    id: 109,
    name: 'Pay de Limón',
    category: 'Postres',
    price: 30,
    image: '/Img/Products/Postres/PayDeLimon.webp',
    description: '',
  },
  {
    id: 110,
    name: 'Tiramisú',
    category: 'Postres',
    price: 32,
    image: '/Img/Products/Postres/Tiramisu.webp',
    description: '',
  },
  {
    id: 111,
    name: 'Torta de Frutas',
    category: 'Postres',
    price: 36,
    image: '/Img/Products/Postres/TortaDeFrutas.webp',
    description: '',
  },
{
    id: 112,
    name: 'Caramelo Surtido',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/Caramelo-surtido.webp',
    description: '',
  },
  {
    id: 113,
    name: 'Caramelos Relleno',
    category: 'Dulces',
    price: 12,
    image: '/Img/Products/Dulces/caramelos-relleno.webp',
    description: '',
  },
  {
    id: 114,
    name: 'Chicles',
    category: 'Dulces',
    price: 8,
    image: '/Img/Products/Dulces/chicles.webp',
    description: '',
  },
  {
    id: 115,
    name: 'Dulce de Leche',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/dulce_de_leche.webp',
    description: '',
  },
  {
    id: 116,
    name: 'Dulces Picantes',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/Dulces_Picantes.webp',
    description: '',
  },
  {
    id: 117,
    name: 'Dulces Ácidos',
    category: 'Dulces',
    price: 9,
    image: '/Img/Products/Dulces/dulces-acidos.webp',
    description: '',
  },
  {
    id: 118,
    name: 'Dulces de Menta',
    category: 'Dulces',
    price: 8,
    image: '/Img/Products/Dulces/dulces-menta.webp',
    description: '',
  },
  {
    id: 119,
    name: 'Duvalín',
    category: 'Dulces',
    price: 6,
    image: '/Img/Products/Dulces/duvalin.webp',
    description: '',
  },
  {
    id: 120,
    name: 'Gomitas Ácidas',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/gomitas-acidas.webp',
    description: '',
  },
  {
    id: 121,
    name: 'Gomitas de Fruta',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/Gomitas-de-Fruta.webp',
    description: '',
  },
  {
    id: 122,
    name: 'Mazapán',
    category: 'Dulces',
    price: 7,
    image: '/Img/Products/Dulces/mazapan.webp',
    description: '',
  },
  {
    id: 123,
    name: 'Paletas de Sabores',
    category: 'Dulces',
    price: 9,
    image: '/Img/Products/Dulces/paletas_de_sabores.webp',
    description: '',
  },
  {
    id: 124,
    name: 'Pulparindo',
    category: 'Dulces',
    price: 6,
    image: '/Img/Products/Dulces/Pulparindo.webp',
    description: '',
  },
  {
    id: 125,
    name: 'Rollitos de Fruta',
    category: 'Dulces',
    price: 8,
    image: '/Img/Products/Dulces/rollitos_de_fruta.webp',
    description: '',
  },
  {
    id: 126,
    name: 'Tamarindo Picante',
    category: 'Dulces',
    price: 10,
    image: '/Img/Products/Dulces/Tamarindo-Picante.webp',
    description: '',
  }
];


export default productsData;