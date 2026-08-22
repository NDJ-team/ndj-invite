export type TemplateLayout = "classic" | "split" | "dark" | "minimal" | "gallery" | "romantic";

export interface Template {
  id: string;
  name: string;
  category: "wedding" | "kyz-uzatuu" | "sunnot-toi" | "tushoo-toi" | "jubilee";
  price: number;
  old_price: number | null;
  image: string;
  short_desc: string;
}

const WEDDING_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1464699908537-0954e50791ee?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&h=800&q=80",
];

const KYZ_UZATUU_IMAGES = [
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1590735213920-68192a487bc2?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=600&h=800&q=80",
];

const SUNNOT_TOI_IMAGES = [
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&h=800&q=80",
];

const TUSHOO_TOI_IMAGES = [
  "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&h=800&q=80",
];

const JUBILEE_IMAGES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1549451371-64aa98a6f660?auto=format&fit=crop&w=600&h=800&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&h=800&q=80",
];

function getImg(category: string, index: number): string {
  const maps: Record<string, string[]> = {
    wedding: WEDDING_IMAGES,
    "kyz-uzatuu": KYZ_UZATUU_IMAGES,
    "sunnot-toi": SUNNOT_TOI_IMAGES,
    "tushoo-toi": TUSHOO_TOI_IMAGES,
    jubilee: JUBILEE_IMAGES,
  };
  const arr = maps[category] || WEDDING_IMAGES;
  return arr[index % arr.length];
}

export const templates: Template[] = [
  // === СВАДЬБА (12) ===
  { id: "secret-garden", name: "Secret Garden", category: "wedding", price: 2890, old_price: 5000, image: getImg("wedding", 0), short_desc: "Романтичный шаблон с цветочными мотивами" },
  { id: "majestic", name: "Majestic", category: "wedding", price: 3200, old_price: null, image: getImg("wedding", 1), short_desc: "Элегантный шаблон с золотыми акцентами" },
  { id: "lake-como", name: "Lake Como", category: "wedding", price: 2990, old_price: null, image: getImg("wedding", 2), short_desc: "Бирюзовые тона и романтика итальянского озера" },
  { id: "dolce-vita", name: "Dolce Vita", category: "wedding", price: 3100, old_price: null, image: getImg("wedding", 3), short_desc: "Итальянская романтика с пастельными тонами" },
  { id: "bridgerton", name: "Bridgerton", category: "wedding", price: 3000, old_price: null, image: getImg("wedding", 4), short_desc: "Регенси-стиль с розовыми акцентами" },
  { id: "ai-nuru", name: "Ai Nuru", category: "wedding", price: 2900, old_price: null, image: getImg("wedding", 5), short_desc: "Светлый и воздушный для свадьбы" },
  { id: "vintage-romance", name: "Vintage Romance", category: "wedding", price: 2800, old_price: 4000, image: getImg("wedding", 6), short_desc: "Винтажная романтика для свадьбы" },
  { id: "timeless-olive", name: "Timeless Olive", category: "wedding", price: 2700, old_price: null, image: getImg("wedding", 7), short_desc: "Оливковые тона для элегантной свадьбы" },
  { id: "timeless-ivory", name: "Timeless Ivory", category: "wedding", price: 2700, old_price: null, image: getImg("wedding", 8), short_desc: "Бежево-белый для классической свадьбы" },
  { id: "timeless-burgundy", name: "Timeless Burgundy", category: "wedding", price: 2800, old_price: null, image: getImg("wedding", 9), short_desc: "Бордовый и золото для романтичной свадьбы" },
  { id: "mediterranean", name: "Mediterranean", category: "wedding", price: 2900, old_price: null, image: getImg("wedding", 10), short_desc: "Средиземноморский стиль для свадьбы" },
  { id: "noir-flowers", name: "Noir Flowers", category: "wedding", price: 3100, old_price: null, image: getImg("wedding", 11), short_desc: "Цветы на черном фоне для свадьбы" },

  // === КЫЗ УЗАТУУ (7) ===
  { id: "manas", name: "Манас", category: "kyz-uzatuu", price: 2800, old_price: null, image: getImg("kyz-uzatuu", 0), short_desc: "Вдохновлено легендой о Манасе" },
  { id: "almanbet", name: "Алманбет", category: "kyz-uzatuu", price: 2600, old_price: null, image: getImg("kyz-uzatuu", 1), short_desc: "Национальный узор с золотыми линиями" },
  { id: "red-lace", name: "Red Lace", category: "kyz-uzatuu", price: 2700, old_price: null, image: getImg("kyz-uzatuu", 2), short_desc: "Белый и красный для торжественной церемонии" },
  { id: "carousel", name: "Carousel", category: "kyz-uzatuu", price: 2500, old_price: null, image: getImg("kyz-uzatuu", 3), short_desc: "Весёлый и яркий для кыз узатуу" },
  { id: "garden-uzatuu", name: "Garden Uzatuu", category: "kyz-uzatuu", price: 2500, old_price: null, image: getImg("kyz-uzatuu", 4), short_desc: "Садовый стиль для церемонии" },
  { id: "floral-uzatuu", name: "Floral Uzatuu", category: "kyz-uzatuu", price: 2700, old_price: null, image: getImg("kyz-uzatuu", 5), short_desc: "Цветочные мотивы для кыз узатуу" },
  { id: "erke-kyz", name: "Эрке Кыз", category: "kyz-uzatuu", price: 2400, old_price: null, image: getImg("kyz-uzatuu", 6), short_desc: "Свободный и современный стиль" },

  // === СҮННӨТ ТОЙ (4) ===
  { id: "amirbek", name: "Амирбек", category: "sunnot-toi", price: 2200, old_price: null, image: getImg("sunnot-toi", 0), short_desc: "Классический шаблон для сүннөт той" },
  { id: "aidar", name: "Айдар", category: "sunnot-toi", price: 2000, old_price: null, image: getImg("sunnot-toi", 1), short_desc: "Синий и золотой для исламского праздника" },
  { id: "ak-jibek", name: "Ак Жибек", category: "sunnot-toi", price: 2400, old_price: null, image: getImg("sunnot-toi", 2), short_desc: "Чистая элегантность для сүннөт той" },
  { id: "aijan", name: "Айжан", category: "sunnot-toi", price: 2100, old_price: null, image: getImg("sunnot-toi", 3), short_desc: "Нежные тона для семейного праздника" },

  // === ТУШОО ТОЙ (6) ===
  { id: "tushoo-toi", name: "Простой Тушоо Той", category: "tushoo-toi", price: 1800, old_price: null, image: getImg("tushoo-toi", 0), short_desc: "Чистый и простой шаблон для дня рождения" },
  { id: "theatro", name: "Theatro", category: "tushoo-toi", price: 2000, old_price: null, image: getImg("tushoo-toi", 1), short_desc: "Театральный шаблон для дня рождения" },
  { id: "red-love", name: "Red Love", category: "tushoo-toi", price: 1800, old_price: null, image: getImg("tushoo-toi", 2), short_desc: "Яркий и праздничный для дня рождения" },
  { id: "premium-elegante", name: "Premium Elegante", category: "tushoo-toi", price: 3500, old_price: null, image: getImg("tushoo-toi", 3), short_desc: "Роскошный шаблон для важного праздника" },
  { id: "photo-booth", name: "Photo Booth", category: "tushoo-toi", price: 2100, old_price: null, image: getImg("tushoo-toi", 4), short_desc: "Фотобудка для вашего праздника" },
  { id: "bloom", name: "Bloom", category: "tushoo-toi", price: 2000, old_price: null, image: getImg("jubilee", 0), short_desc: "Цветущий шаблон для праздника" },

  // === ЮБИЛЕЙ (5) ===
  { id: "kumush", name: "Күмүш", category: "jubilee", price: 2300, old_price: 4000, image: getImg("jubilee", 1), short_desc: "Серебряный шаблон для юбилея" },
  { id: "elegaza", name: "Eleganza", category: "jubilee", price: 3000, old_price: null, image: getImg("jubilee", 2), short_desc: "Итальянская элегантность для юбилея" },
  { id: "bellagio", name: "Bellagio", category: "jubilee", price: 3800, old_price: null, image: getImg("jubilee", 3), short_desc: "Роскошный шаблон для большого юбилея" },
  { id: "countryside", name: "Countryside", category: "jubilee", price: 2200, old_price: null, image: getImg("wedding", 5), short_desc: "Деревенский стиль для праздника" },
  { id: "classic-romance", name: "Classic Romance", category: "jubilee", price: 2600, old_price: null, image: getImg("wedding", 6), short_desc: "Классическая романтика для юбилея" },

  // === ДОПОЛНИТЕЛЬНЫЕ ШАБЛОНЫ (16) ===
  { id: "pure-love", name: "Pure Love", category: "tushoo-toi", price: 1900, old_price: null, image: getImg("tushoo-toi", 0), short_desc: "Чистый и яркий для праздника" },
  { id: "noir", name: "Noir", category: "wedding", price: 3000, old_price: null, image: getImg("wedding", 1), short_desc: "Черно-белый шаблон для свадьбы" },
  { id: "ivory-garden", name: "Ivory Garden", category: "wedding", price: 2600, old_price: null, image: getImg("wedding", 2), short_desc: "Сад для свадьбы с бежевыми тонами" },
  { id: "ivory-flower", name: "Ivory Flower", category: "wedding", price: 2400, old_price: null, image: getImg("wedding", 3), short_desc: "Цветы для свадьбы на бежевом фоне" },
  { id: "rose-wreath", name: "Rose Wreath", category: "wedding", price: 2500, old_price: null, image: getImg("wedding", 4), short_desc: "Розовый орнамент для свадьбы" },
  { id: "floral-ivory", name: "Floral Ivory", category: "wedding", price: 2300, old_price: null, image: getImg("wedding", 5), short_desc: "Цветы на бежевом фоне для свадьбы" },
  { id: "floral-garden", name: "Floral Garden", category: "wedding", price: 2700, old_price: null, image: getImg("wedding", 6), short_desc: "Цветочный сад для свадьбы" },
  { id: "day-night", name: "Day & Night", category: "wedding", price: 3000, old_price: null, image: getImg("wedding", 7), short_desc: "День и ночь для свадьбы с двумя тонами" },
  { id: "floral-ivory-2", name: "Floral Ivory II", category: "wedding", price: 2500, old_price: null, image: getImg("wedding", 8), short_desc: "Цветы на белом фоне" },
  { id: "rustic-lace", name: "Rustic Lace", category: "tushoo-toi", price: 2200, old_price: null, image: getImg("tushoo-toi", 2), short_desc: "Деревенский узор для праздника" },
  { id: "olive-lace", name: "Olive Lace", category: "wedding", price: 2600, old_price: null, image: getImg("wedding", 3), short_desc: "Оливковый узор для свадьбы" },
  { id: "papaer-craft", name: "Papercraft", category: "wedding", price: 2500, old_price: null, image: getImg("wedding", 4), short_desc: "Бумажный стиль для свадьбы" },
  { id: "la-maison", name: "La Maison", category: "wedding", price: 3200, old_price: null, image: getImg("wedding", 5), short_desc: "Французский узор для свадьбы" },
  { id: "aruu", name: "Арүү", category: "jubilee", price: 2100, old_price: null, image: getImg("jubilee", 1), short_desc: "Простой шаблон для юбилея" },
  { id: "coastal-blue", name: "Coastal Blue", category: "wedding", price: 2800, old_price: null, image: getImg("wedding", 6), short_desc: "Морской синий для свадьбы" },
  { id: "blue-florals", name: "Blue Florals", category: "wedding", price: 2500, old_price: null, image: getImg("wedding", 7), short_desc: "Синие цветы для свадьбы" },
];
