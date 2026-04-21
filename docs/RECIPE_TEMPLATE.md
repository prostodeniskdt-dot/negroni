# Шаблон данных для нового рецепта

Заполните поля ниже и передайте агенту или разработчику для добавления рецепта в коллекцию.

---

## 1. Точка на карте (RecipeEntry)

| Поле | Пример | Обязательно |
|------|--------|-------------|
| **id** | `yaroslavl`, `moscow` | Да. Уникальный латинский идентификатор без пробелов |
| **city** | Ярославль, Москва | Да. Название города для карты |
| **lat** | 57.6299 | Да. Широта (число) |
| **lng** | 39.8737 | Да. Долгота (число) |

---

## 2. Рецепт (Recipe)

| Поле | Пример | Обязательно |
|------|--------|-------------|
| **name** | Ярославский Негрони | Да. Название коктейля |
| **region** | Ярославль | Да. Регион (город/страна) |
| **author** | Александра Таран | Да. Автор или команда |
| **bar** | Good Karma bar | Да. Название бара или «—» |
| **barCity** | Ярославль | Да. Город бара |
| **barDescription** | 1–2 предложения о баре/концепции | Да |
| **difficulty** | `easy` \| `medium` \| `hard` | Да |
| **category** | классический, травяной, медовый… | Да |
| **tags** | тег1, тег2, тег3 | Да. Через запятую или список |
| **intro** | Краткое описание рецепта (1–3 предложения) | Да |
| **image** | URL фото или путь `/images/name.jpg` | Да |
| **method** | Stir или Build | Да |
| **glass** | Rocks, Coupe… | Да |
| **garnish** | Апельсиновая цедра | Да |
| **ice** | Large cube, Cubed ice | Да |
| **ingredients** | Каждый с новой строки или списком | Да |
| **steps** | Шаги приготовления по порядку | Да |
| **flavorProfile** | bitter, sweet, sour, spicy, strong (числа 1–10) | Да |

### Ссылки (опционально, для кнопок на карточке)

| Поле | Пример |
|------|--------|
| **authorInstagram** | https://instagram.com/alexandra_taran или @alexandra_taran |
| **authorTg** | https://t.me/taranalexandra или @taranalexandra |
| **barLink** | https://www.instagram.com/goodkarma.bar |

---

## 3. Пребатч (prebatch)

- **Нет заготовки:** написать одну фразу или «нет».
- **Есть заготовка — объект:**
  - **name** — название
  - **ingredients** — список ингредиентов
  - **steps** — шаги по порядку

---

## 4. Вкусовой профиль (flavorProfile)

Все числа от 1 до 10:

- **bitter** — горечь  
- **sweet** — сладость  
- **sour** — кислотность  
- **spicy** — пряность / травянистость  
- **strong** — крепость  

Пример: `bitter 4, sweet 5, sour 3, spicy 4, strong 7`

---

## 5. Текстовый шаблон для вставки (один рецепт)

```
НОВЫЙ РЕЦЕПТ

id: 
city: 
lat: 
lng: 

name: 
region: 
author: 
bar: 
barCity: 
barDescription: 
difficulty: easy|medium|hard
category: 
tags: 
intro: 
image: 
method: Stir|Build
glass: 
garnish: 
ice: 

authorInstagram: 
authorTg: 
barLink: 

flavorProfile: bitter , sweet , sour , spicy , strong 

ingredients:
- 
- 

steps:
1. 
2. 

prebatch: (текст или объект name/ingredients/steps)
```
