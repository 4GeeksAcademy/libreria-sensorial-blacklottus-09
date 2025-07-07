export const exampleProducts = [
    {
        id: 1,
        name: "Misterio en la Noche Victoriana",
        price: "38.99",
        description: "Un kit diseñado para sumergirte en las neblinosas calles de Londres. Resuelve el caso junto al detective más famoso mientras el aroma a sándalo y tabaco llena la habitación.",
        stock_quantity: 15,
        images: [
            { id: 1, image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", alt_text: "Libro antiguo sobre una mesa de madera" },
            { id: 2, image_url: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff", alt_text: "Vela encendida en la oscuridad" },
        ],
        category: { id: 1, name: 'Misterio y Enigma' },
        genre: { id: 1, name: 'Misterio y Thriller' },
        components: {
            book: { title: "Estudio en Escarlata", author: "Arthur Conan Doyle" },
            aroma: { name: "Vela de Sándalo y Tabaco", description: "Un aroma que evoca una biblioteca antigua y el humo de una pipa." },
            recipe: { name: "Té Earl Grey con un toque de leche", description: "El acompañante perfecto para una lectura nocturna." },
            music: { name: "Sonidos de Violín y Lluvia", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 2,
        name: "Tarde de Manta y Café",
        price: "35.99",
        description: "La experiencia definitiva para un día acogedor en casa. Envuelvete en una historia reconfortante mientras disfrutas del aroma a café recién hecho y una playlist de jazz suave.",
        stock_quantity: 20,
        images: [
            { id: 3, image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", alt_text: "Taza de café humeante" },
            { id: 4, image_url: "https://images.unsplash.com/photo-1588666307553-5d364402663c", alt_text: "Persona leyendo bajo una manta" },
        ],
        category: { id: 2, name: 'Momentos Acogedores' },
        genre: { id: 2, name: 'Clásicos' },
        components: {
            book: { title: "Mujercitas", author: "Louisa May Alcott" },
            aroma: { name: "Cera para derretir de Manzana y Canela", description: "Un olor dulce y hogareño que llena cualquier espacio." },
            recipe: { name: "Café Latte con Nuez Moscada", description: "Cremoso, especiado y perfecto para acompañar un clásico." },
            music: { name: "Jazz Acústico y Relajante", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 3,
        name: "Expedición a la Tierra Media",
        price: "42.50",
        description: "Embárcate en un viaje épico a través de montañas y bosques encantados. Este kit está pensado para los aventureros que desean sentir el crujir de las hojas y el olor a pino.",
        stock_quantity: 12,
        images: [
            { id: 5, image_url: "https://images.unsplash.com/photo-1508921324449-73f112453397", alt_text: "Mapa antiguo sobre una mesa de madera" },
            { id: 6, image_url: "https://images.unsplash.com/photo-1618335829737-255f15773210", alt_text: "Bosque denso y neblinoso" },
        ],
        category: { id: 3, name: 'Viajes y Aventura' },
        genre: { id: 3, name: 'Ciencia Ficción y Fantasía' },
        components: {
            book: { title: "El Hobbit", author: "J.R.R. Tolkien" },
            aroma: { name: "Incienso de Pino y Musgo de Roble", description: "El olor de un bosque antiguo y profundo." },
            recipe: { name: "Estofado Rústico del Viajero", description: "Un plato caliente y sustancioso para recuperar fuerzas." },
            music: { name: "Bandas Sonoras Épicas", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 4,
        name: "El Silencio de los Inocentes",
        price: "40.99",
        description: "Adéntrate en la mente de un genio del mal. Un kit escalofriante con un vino tinto intenso y una playlist que mantendrá la tensión al máximo.",
        stock_quantity: 8,
        images: [{ id: 7, image_url: "https://picsum.photos/seed/4/400/300", alt_text: "Pasillo oscuro y tétrico" }],
        category: { id: 1, name: 'Misterio y Enigma' },
        genre: { id: 1, name: 'Misterio y Thriller' },
        components: {
            book: { title: "El Silencio de los Corderos", author: "Thomas Harris" },
            aroma: { name: "Vela de Cuero y Cereza Negra", description: "Un aroma profundo y perturbador." },
            recipe: { name: "Copa de Vino Chianti", description: "El maridaje perfecto para una cena... inquietante." },
            music: { name: "Clásicos del Suspense", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 5,
        name: "Cita con Agatha Christie",
        price: "37.50",
        description: "Resuelve un asesinato en el Orient Express con la dama del misterio. Acompaña la lectura con un clásico té inglés y galletas de mantequilla.",
        stock_quantity: 11,
        images: [{ id: 8, image_url: "https://picsum.photos/seed/5/400/300", alt_text: "Interior de un vagón de tren antiguo" }],
        category: { id: 1, name: 'Misterio y Enigma' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "Asesinato en el Orient Express", author: "Agatha Christie" },
            aroma: { name: "Aroma a Lino Limpio", description: "El olor de los impecables vagones de un tren de lujo." },
            recipe: { name: "Té Inglés con Galletas", description: "La merienda perfecta para un detective aficionado." },
            music: { name: "Jazz de los Años 30", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 6,
        name: "El Código Da Vinci",
        price: "39.99",
        description: "Recorre París y descifra antiguos secretos. Este kit incluye un café espresso doble para mantenerte alerta y el aroma a incienso de catedral.",
        stock_quantity: 14,
        images: [{ id: 9, image_url: "https://picsum.photos/seed/6/400/300", alt_text: "Símbolos antiguos en un pergamino" }],
        category: { id: 1, name: 'Misterio y Enigma' },
        genre: { id: 1, name: 'Misterio y Thriller' },
        components: {
            book: { title: "El Código Da Vinci", author: "Dan Brown" },
            aroma: { name: "Incienso de Mirra y Olíbano", description: "El aroma solemne de los secretos eclesiásticos." },
            recipe: { name: "Espresso Doble", description: "Para noches de investigación sin descanso." },
            music: { name: "Cantos Gregorianos y Coros", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 7,
        name: "Gótico Americano",
        price: "36.99",
        description: "Explora la locura y lo macabro con un maestro del terror. Ideal para leer a la luz de una vela con el sonido de una tormenta de fondo.",
        stock_quantity: 9,
        images: [{ id: 10, image_url: "https://picsum.photos/seed/7/400/300", alt_text: "Un cuervo posado en una calavera" }],
        category: { id: 1, name: 'Misterio y Enigma' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "El Corazón Delator y otros cuentos", author: "Edgar Allan Poe" },
            aroma: { name: "Vela de Cera de Abeja", description: "Una luz parpadeante para leer historias oscuras." },
            recipe: { name: "Vaso de Amontillado", description: "Una copa para brindar por destinos fatídicos." },
            music: { name: "Sonido de Tormenta y Violonchelo", url: "https://open.spotify.com/playlist/..." }
        }
    },
    // --- Categoría: Momentos Acogedores ---
    {
        id: 8,
        name: "Orgullo y Prejuicio en el Campo",
        price: "34.99",
        description: "Disfruta de un romance de época con la calidez de un té de manzanilla y el aroma a un jardín de rosas inglés.",
        stock_quantity: 18,
        images: [{ id: 11, image_url: "https://picsum.photos/seed/8/400/300", alt_text: "Taza de té floral y un libro" }],
        category: { id: 2, name: 'Momentos Acogedores' },
        genre: { id: 3, name: 'Romance' },
        components: {
            book: { title: "Orgullo y Prejuicio", author: "Jane Austen" },
            aroma: { name: "Vela de Rosas Inglesas", description: "El perfume de un jardín en la campiña." },
            recipe: { name: "Infusión de Manzanilla y Miel", description: "Una bebida caliente y calmante." },
            music: { name: "Piano Clásico - Piezas Románticas", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 9,
        name: "Crónicas de Narnia: El León",
        price: "39.00",
        description: "Atraviesa el ropero hacia un mundo de nieve y magia. Ideal para disfrutar con un chocolate caliente espeso y especiado.",
        stock_quantity: 22,
        images: [{ id: 12, image_url: "https://picsum.photos/seed/9/400/300", alt_text: "Puerta de madera en un bosque nevado" }],
        category: { id: 2, name: 'Momentos Acogedores' },
        genre: { id: 3, name: 'Ciencia Ficción y Fantasía' },
        components: {
            book: { title: "El león, la bruja y el ropero", author: "C.S. Lewis" },
            aroma: { name: "Aroma a Pino Nevado", description: "El aire fresco y limpio de un bosque en invierno." },
            recipe: { name: "Chocolate Caliente Turco", description: "Espeso, dulce y reconfortante." },
            music: { name: "Bandas Sonoras de Fantasía", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 10,
        name: "El Principito y las Estrellas",
        price: "32.99",
        description: "Una experiencia para reflexionar sobre la vida y la amistad. Acompaña esta lectura filosófica con un té de jazmín y el silencio de la noche.",
        stock_quantity: 25,
        images: [{ id: 13, image_url: "https://picsum.photos/seed/10/400/300", alt_text: "Un pequeño planeta con una rosa" }],
        category: { id: 2, name: 'Momentos Acogedores' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "El Principito", author: "Antoine de Saint-Exupéry" },
            aroma: { name: "Vela de Jazmín Nocturno", description: "Un aroma delicado para pensamientos profundos." },
            recipe: { name: "Té de Flores de Jazmín", description: "Una bebida ligera y aromática." },
            music: { name: "Música Ambiental Espacial", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 11,
        name: "Matilda y el Chocolate",
        price: "33.50",
        description: "Un kit mágico y divertido para celebrar el poder de la imaginación. Incluye una receta para el pastel de chocolate más delicioso.",
        stock_quantity: 15,
        images: [{ id: 14, image_url: "https://picsum.photos/seed/11/400/300", alt_text: "Pila de libros coloridos" }],
        category: { id: 2, name: 'Momentos Acogedores' },
        genre: { id: 3, name: 'Ciencia Ficción y Fantasía' },
        components: {
            book: { title: "Matilda", author: "Roald Dahl" },
            aroma: { name: "Aroma a Tarta de Chocolate", description: "El irresistible olor del cacao y el bizcocho." },
            recipe: { name: "Receta del Pastel de Chocolate de Bruce", description: "Un desafío delicioso y chocolatoso." },
            music: { name: "Pop Divertido de los 90", url: "https://open.spotify.com/playlist/..." }
        }
    },
    // --- Categoría: Viajes y Aventura ---
    {
        id: 12,
        name: "La Odisea del Héroe Griego",
        price: "41.00",
        description: "Embárcate en un viaje épico por el Mediterráneo antiguo. Siente la brisa del mar con un aroma salino y degusta aceitunas y queso feta.",
        stock_quantity: 10,
        images: [{ id: 15, image_url: "https://picsum.photos/seed/12/400/300", alt_text: "Barco griego antiguo en el mar" }],
        category: { id: 3, name: 'Viajes y Aventura' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "La Odisea", author: "Homero" },
            aroma: { name: "Vela de Brisa Marina y Sal", description: "El olor del mar Egeo y las costas rocosas." },
            recipe: { name: "Aperitivo de Aceitunas Kalamata y Queso Feta", description: "Sabores auténticos de Grecia." },
            music: { name: "Música Tradicional Griega", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 13,
        name: "20,000 Leguas de Viaje Submarino",
        price: "39.99",
        description: "Explora las profundidades del océano a bordo del Nautilus. Un kit con aromas acuáticos y una playlist misteriosa y envolvente.",
        stock_quantity: 13,
        images: [{ id: 16, image_url: "https://picsum.photos/seed/13/400/300", alt_text: "Vista submarina con corales" }],
        category: { id: 3, name: 'Viajes y Aventura' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "20,000 Leguas de Viaje Submarino", author: "Julio Verne" },
            aroma: { name: "Sales de Baño Oceánicas", description: "Sumérgete en un baño con el aroma del océano profundo." },
            recipe: { name: "Cóctel 'El Nautilus' (sin alcohol)", description: "Una bebida azul y refrescante." },
            music: { name: "Sonidos del Océano y Sintetizadores", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 14,
        name: "Aventura en el Amazonas",
        price: "38.00",
        description: "Adéntrate en el corazón de la selva con este kit vibrante. Aromas a tierra húmeda y frutas tropicales te acompañarán en la lectura.",
        stock_quantity: 7,
        images: [{ id: 17, image_url: "https://picsum.photos/seed/14/400/300", alt_text: "Río caudaloso en la selva amazónica" }],
        category: { id: 3, name: 'Viajes y Aventura' },
        genre: { id: 5, name: 'No Ficción' },
        components: {
            book: { title: "El río de la duda", author: "Candice Millard" },
            aroma: { name: "Incienso de Copal y Palo Santo", description: "El perfume místico de la selva." },
            recipe: { name: "Agua de Maracuyá y Mango", description: "Un refresco tropical y exótico." },
            music: { name: "Sonidos de la Selva y Ritmos Tribales", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 15,
        name: "Dune: El Planeta Desierto",
        price: "45.00",
        description: "Sobrevive a las arenas de Arrakis. Un kit con té de especias exóticas y un aroma cálido y seco que te transportará a otro mundo.",
        stock_quantity: 10,
        images: [{ id: 18, image_url: "https://picsum.photos/seed/15/400/300", alt_text: "Vasto desierto de dunas de arena" }],
        category: { id: 3, name: 'Viajes y Aventura' },
        genre: { id: 3, name: 'Ciencia Ficción y Fantasía' },
        components: {
            book: { title: "Dune", author: "Frank Herbert" },
            aroma: { name: "Vela de Ámbar y Especias", description: "El olor cálido y místico del desierto." },
            recipe: { name: "Té Chai con Leche de Avena", description: "Una bebida especiada para climas áridos." },
            music: { name: "Paisajes Sonoros Épicos y Electrónicos", url: "https://open.spotify.com/playlist/..." }
        }
    },
    // --- Categoría: Romance y Pasión ---
    {
        id: 16,
        name: "Amor en los Tiempos del Cólera",
        price: "39.50",
        description: "Vive una historia de amor eterno en el Caribe mágico. Un kit con aroma a flores tropicales y un café de grano intenso.",
        stock_quantity: 16,
        images: [{ id: 19, image_url: "https://picsum.photos/seed/16/400/300", alt_text: "Balcón colonial con flores" }],
        category: { id: 4, name: 'Romance y Pasión' },
        genre: { id: 3, name: 'Romance' },
        components: {
            book: { title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez" },
            aroma: { name: "Vela de Gardenia y Maracuyá", description: "El perfume embriagador del trópico." },
            recipe: { name: "Café Caribeño con un toque de Ron", description: "Un café con carácter y pasión." },
            music: { name: "Boleros y Cumbias Clásicas", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 17,
        name: "Como Agua para Chocolate",
        price: "40.00",
        description: "Una historia de amor y gastronomía en el México revolucionario. Cada capítulo te inspirará a probar las recetas que unen a los amantes.",
        stock_quantity: 11,
        images: [{ id: 20, image_url: "https://picsum.photos/seed/17/400/300", alt_text: "Cocina rústica mexicana con ingredientes" }],
        category: { id: 4, name: 'Romance y Pasión' },
        genre: { id: 3, name: 'Romance' },
        components: {
            book: { title: "Como agua para chocolate", author: "Laura Esquivel" },
            aroma: { name: "Cera para derretir de Chocolate y Chile", description: "Una combinación de dulzura y pasión." },
            recipe: { name: "Chocolate a la Taza con Canela", description: "La bebida que despierta los sentidos." },
            music: { name: "Rancheras y Música Tradicional Mexicana", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 18,
        name: "Cumbres Borrascosas",
        price: "37.99",
        description: "Un amor oscuro y tormentoso en los páramos ingleses. Perfecto para una noche de viento con un té negro fuerte.",
        stock_quantity: 7,
        images: [{ id: 21, image_url: "https://picsum.photos/seed/18/400/300", alt_text: "Páramos con niebla y brezo" }],
        category: { id: 4, name: 'Romance y Pasión' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "Cumbres Borrascosas", author: "Emily Brontë" },
            aroma: { name: "Incienso de Brezo y Tierra Húmeda", description: "El olor salvaje y melancólico de los páramos." },
            recipe: { name: "Té Negro Inglés Fuerte", description: "Una bebida intensa para una historia apasionada." },
            music: { name: "Sonido del Viento y Piano Dramático", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 19,
        name: "Posdata: Te Quiero",
        price: "35.00",
        description: "Una historia emotiva sobre el amor, la pérdida y los nuevos comienzos en la campiña irlandesa. Prepara los pañuelos y una taza de té reconfortante.",
        stock_quantity: 20,
        images: [{ id: 22, image_url: "https://picsum.photos/seed/19/400/300", alt_text: "Paisaje verde de Irlanda" }],
        category: { id: 4, name: 'Romance y Pasión' },
        genre: { id: 3, name: 'Romance' },
        components: {
            book: { title: "Posdata: Te Quiero", author: "Cecelia Ahern" },
            aroma: { name: "Vela de Trébol y Hierba Fresca", description: "El aroma de los campos irlandeses después de la lluvia." },
            recipe: { name: "Té Irlandés de Desayuno con Leche", description: "Una taza fuerte y reconfortante." },
            music: { name: "Música Celta y Baladas Irlandesas", url: "https://open.spotify.com/playlist/..." }
        }
    },
    // --- Categoría: Reflexión y Calma ---
    {
        id: 20,
        name: "El Hombre en Busca de Sentido",
        price: "34.00",
        description: "Una lectura profunda sobre la resiliencia y el propósito de la vida. Ideal para acompañar con una infusión herbal y un momento de meditación.",
        stock_quantity: 15,
        images: [{ id: 23, image_url: "https://picsum.photos/seed/20/400/300", alt_text: "Silueta de una persona mirando el amanecer" }],
        category: { id: 5, name: 'Reflexión y Calma' },
        genre: { id: 5, name: 'No Ficción' },
        components: {
            book: { title: "El hombre en busca de sentido", author: "Viktor Frankl" },
            aroma: { name: "Aceite esencial de Lavanda", description: "Un aroma para la calma y la claridad mental." },
            recipe: { name: "Infusión de Tila y Melisa", description: "Una bebida para relajar cuerpo y mente." },
            music: { name: "Música para Meditación y Mindfulness", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 21,
        name: "Siddhartha: Un Viaje Espiritual",
        price: "36.50",
        description: "Acompaña a Siddhartha en su búsqueda de la iluminación. Un kit con té verde matcha y aroma a flor de loto para una experiencia zen.",
        stock_quantity: 13,
        images: [{ id: 24, image_url: "https://picsum.photos/seed/21/400/300", alt_text: "Estatua de Buda y flor de loto" }],
        category: { id: 5, name: 'Reflexión y Calma' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "Siddhartha", author: "Hermann Hesse" },
            aroma: { name: "Incienso de Flor de Loto", description: "Un perfume que invita a la introspección." },
            recipe: { name: "Té Verde Matcha Ceremonial", description: "Una bebida para centrar la atención." },
            music: { name: "Sonidos de Cuencos Tibetanos", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 22,
        name: "Walden: La Vida en los Bosques",
        price: "35.50",
        description: "Desconecta de la sociedad y reconecta con la naturaleza. Este kit te invita a la simplicidad con aromas a pino y tierra.",
        stock_quantity: 10,
        images: [{ id: 25, image_url: "https://picsum.photos/seed/22/400/300", alt_text: "Cabaña de madera junto a un lago" }],
        category: { id: 5, name: 'Reflexión y Calma' },
        genre: { id: 4, name: 'Clásicos' },
        components: {
            book: { title: "Walden", author: "Henry David Thoreau" },
            aroma: { name: "Vela de Agujas de Pino", description: "El aire fresco y puro de un bosque de coníferas." },
            recipe: { name: "Agua fresca con pepino y menta", description: "Una bebida simple y purificante." },
            music: { name: "Sonidos de la Naturaleza: Bosque y Riachuelo", url: "https://open.spotify.com/playlist/..." }
        }
    },
    {
        id: 23,
        name: "El Alquimista",
        price: "38.00",
        description: "Sigue tu Leyenda Personal en un viaje a través del desierto. Un kit para soñadores, con té de menta y un aroma a especias lejanas.",
        stock_quantity: 25,
        images: [{ id: 26, image_url: "https://picsum.photos/seed/23/400/300", alt_text: "Pirámides en el desierto al atardecer" }],
        category: { id: 5, name: 'Reflexión y Calma' },
        genre: { id: 3, name: 'Ciencia Ficción y Fantasía' },
        components: {
            book: { title: "El Alquimista", author: "Paulo Coelho" },
            aroma: { name: "Vela de Canela y Naranja", description: "Un aroma cálido que inspira a seguir las señales." },
            recipe: { name: "Té de Menta Marroquí", description: "Una bebida tradicional para acompañar historias." },
            music: { name: "Música Ambiental del Medio Oriente", url: "https://open.spotify.com/playlist/..." }
        }
    }
];