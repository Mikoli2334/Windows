# 🪟 ЕвроОкна РБ — Сайт установки евроокон

Одностраничный сайт для компании по установке пластиковых окон в Беларуси.

## 🏗️ Архитектура

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Nginx     │────▸│   Next.js    │     │  FastAPI    │
│   :80       │     │   :3000      │────▸│  :8000     │
│  (прокси)   │────▸│  (SSR/SEO)   │     │  (API)     │
└─────────────┘     └──────────────┘     └──────┬─────┘
                                                │
                                         ┌──────▼─────┐
                                         │   SQLite   │
                                         │   (БД)     │
                                         └────────────┘
```

### Стек технологий

| Компонент | Технология |
|-----------|------------|
| Frontend  | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend   | Python 3.12, FastAPI, SQLAlchemy, Pydantic |
| Database  | SQLite |
| Proxy     | Nginx |
| Deploy    | Docker, Docker Compose |

## 🚀 Запуск

### Разработка (с hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### Продакшн

```bash
docker-compose up --build -d
```

- Сайт: http://localhost

## 📁 Структура проекта

```
eurowindows/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── routers/        # API эндпоинты
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── services.py     # Калькулятор цен
│   │   ├── database.py     # Настройка SQLite
│   │   └── main.py         # FastAPI приложение
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (SEO метатеги)
│   │   ├── page.tsx        # Главная страница
│   │   └── globals.css     # Глобальные стили
│   ├── components/
│   │   ├── sections/       # Секции лендинга
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Advantages.tsx
│   │   │   ├── WindowTypes.tsx
│   │   │   ├── WindowConstructor.tsx  ⭐ Конструктор окон
│   │   │   ├── Process.tsx
│   │   │   ├── Appointment.tsx        ⭐ Запись на замер
│   │   │   ├── Contacts.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       └── AnimateIn.tsx
│   ├── lib/
│   │   └── api.ts          # API клиент + типы
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── docker-compose.yml      # Продакшн
├── docker-compose.dev.yml  # Разработка
├── nginx.conf
└── README.md
```

## ⭐ Ключевые фичи

### Конструктор окон
- Выбор типа: одностворчатое, двухстворчатое, трёхстворчатое, балконный блок, панорамное, арочное
- Настройка размеров (слайдеры ширина/высота)
- Выбор стеклопакета: однокамерный, двухкамерный, энергосберегающий, шумозащитный
- Профиль: эконом, стандарт, премиум
- Тип открывания: глухое, поворотное, откидное, поворотно-откидное
- Цвет профиля: белый, коричневый, дуб, антрацит
- Опции: москитная сетка, подоконник, откосы
- SVG-превью окна в реальном времени
- Мгновенный расчёт стоимости
- Корзина для нескольких окон

### Запись на замер
- Пошаговая форма (3 шага)
- Выбор типа записи
- Календарь на 2 недели вперёд
- Доступные временные слоты (с проверкой через API)
- Выбор города
- Подтверждение записи

### SEO
- Server-Side Rendering (Next.js SSR)
- Семантическая HTML-разметка
- JSON-LD structured data (LocalBusiness)
- Open Graph метатеги
- Мета-теги keywords, description

### Дизайн
- Тёмная тема с glassmorphism-эффектами
- Framer Motion анимации (scroll-reveal, stagger, transitions)
- Полностью адаптивный (mobile-first)
- Кастомные SVG-иллюстрации окон

## 🔌 API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/windows/types` | Список типов окон |
| POST | `/api/windows/calculate-price` | Расчёт стоимости |
| POST | `/api/orders/` | Создание заказа |
| GET | `/api/orders/{id}` | Получение заказа |
| POST | `/api/appointments/` | Создание записи |
| GET | `/api/appointments/available-slots?date=YYYY-MM-DD` | Доступные слоты |
| POST | `/api/appointments/contact` | Обратная связь |

## 🔧 Настройка

Скопируйте `.env.example` в `.env` и настройте переменные при необходимости.

Цены на окна настраиваются в `backend/app/services.py`.
Типы окон сидируются автоматически при первом запросе к API.
