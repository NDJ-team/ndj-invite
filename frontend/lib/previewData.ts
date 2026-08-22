import { Template, TemplateLayout } from "./templates";

export function getLayoutForTemplate(template: Template, index: number): TemplateLayout {
  const layouts: TemplateLayout[] = ["classic", "split", "dark", "minimal", "gallery", "romantic"];
  
  // Category-based preference
  const categoryMap: Record<string, TemplateLayout[]> = {
    wedding: ["classic", "romantic", "split", "dark", "minimal"],
    "kyz-uzatuu": ["split", "romantic", "classic", "dark", "gallery"],
    "sunnot-toi": ["minimal", "dark", "classic", "split", "romantic"],
    "tushoo-toi": ["gallery", "romantic", "classic", "split", "minimal"],
    jubilee: ["dark", "gallery", "classic", "romantic", "split"],
  };

  const preferred = categoryMap[template.category] || layouts;
  return preferred[index % preferred.length];
}

export interface PreviewData {
  names: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  dresscode: string;
  accentColor: string;
}

export function getPreviewData(template: Template): PreviewData {
  const dataMap: Record<string, PreviewData> = {
    wedding: {
      names: "Алия & Бекзат",
      date: "15 сентября 2026",
      time: "17:00",
      venue: "Ресторан «Бишкек Парк»",
      address: "г. Бишкек, ул. Чуй 123",
      message: "Дорогие наши родные и друзья! Мы рады пригласить вас разделить нашу радость в один из самых важных дней нашей жизни.",
      dresscode: "Элегантная одежда. Цветовая палитра: золото, белый, бежевый.",
      accentColor: "#C9A96E",
    },
    "kyz-uzatuu": {
      names: "Жибек",
      date: "20 октября 2026",
      time: "18:00",
      venue: "Банкетный зал «Алтын Ордо»",
      address: "г. Бишкек, пр. Манаса 45",
      message: "Дорогие родные и друзья! Наша дочь Жибек отправляется в новую жизнь. Приглашаем вас на торество проводы.",
      dresscode: "Нарядная одежда. Приветствуются национальные мотивы.",
      accentColor: "#D4A574",
    },
    "sunnot-toi": {
      names: "Айдар",
      date: "5 ноября 2026",
      time: "12:00",
      venue: "Ресторан «Нооруз»",
      address: "г. Бишкек, ул. Ленина 78",
      message: "Дорогие родные! Приглашаем вас на сүннөт той — важный день в жизни нашего сына Айдара.",
      dresscode: "Чистая, скромная одежда. Приветствуется белый цвет.",
      accentColor: "#1E5F74",
    },
    "tushoo-toi": {
      names: "Нурислам",
      date: "25 декабря 2026",
      time: "15:00",
      venue: "Кафе «Булочная №1»",
      address: "г. Бишкек, ул. Тынчтыкова 12",
      message: "Дорогие друзья! Приглашаем вас на тушоо той нашего малыша Нурислама. Разделим нашу радость вместе!",
      dresscode: "Лёгкая, праздничная одежда. Яркие цвета приветствуются!",
      accentColor: "#FF6B6B",
    },
    jubilee: {
      names: "Абдулла",
      date: "1 января 2027",
      time: "18:00",
      venue: "Гостиница «Хаятт Риджент»",
      address: "г. Бишкек, пр. Дуйшеналиева 10",
      message: "Дорогие друзья и коллеги! Приглашаем вас на торественное мероприятие, посвящённое юбилею.",
      dresscode: "Вечерний дресс-код. Классический стиль.",
      accentColor: "#8B6914",
    },
  };

  return dataMap[template.category] || dataMap.wedding;
}
