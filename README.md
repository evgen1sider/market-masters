# 🏦 My Economic Game

[![CI](https://github.com/evgen1sider/market-masters/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/evgen1sider/market-masters/actions/workflows/ci.yml?query=branch%3Adevelop)

<!-- Additional badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-18.x-brightgreen.svg)](https://nodejs.org/)
[![Issues](https://img.shields.io/github/issues/evgen1sider/market-masters)](https://github.com/evgen1sider/market-masters/issues)
[![Codecov](https://codecov.io/gh/evgen1sider/market-masters/branch/develop/graph/badge.svg?token=)](https://codecov.io/gh/evgen1sider/market-masters)

**My Economic Game** – це захоплююча економічна гра, в якій гравці можуть торгувати, інвестувати та розвивати свій бізнес!

## 🚀 Функції гри
- 📈 **Торгівля**: Купуй і продавай ресурси за динамічними ринковими цінами.
- 🏗 **Розвиток бізнесу**: Будуй підприємства та інвестуй у нові технології.
- 💰 **Фінансові стратегії**: Випробуй свої навички управління економікою.
- 🌍 **Мультиплеєр** (опціонально): Грай з друзями та змагайся за лідерство.

## 🔧 Встановлення
Щоб запустити гру локально, виконайте наступні команди:

```sh
git clone https://github.com/your-username/my-economic-game.git
cd my-economic-game
npm install
npm start
```

## Локальний запуск у цьому репозиторії
Якщо ви працюєте з цим репозиторієм, запустіть:

```sh
# Встановити залежності (dev dependencies для lint/tests)
npm install

# Запустити простий статичний сервер
npm start

# Лінт
npm run lint

# Тести (Jest)
npm test
```

## Політика кінців рядків
У цьому репозиторії є файл `.gitattributes`, який забезпечує збереження LF (`\n`) у репозиторії для коду та конфігів. Щоб локально перевірити наявність CRLF у файлах можна запустити:

```sh
npm run check:eol
```

Якщо скрипт знайде файли з CRLF, виконайте нормалізацію:

```sh
git add --renormalize .
git commit -m "Normalize line endings"
```

 ##  Технології
Node.js
Express.js (або інший бекенд)
React.js (або інший фронтенд)
MongoDB / PostgreSQL (якщо потрібна база даних)

## 📜 Ліцензія
Цей проєкт розповсюджується за ліцензією MIT.

## 📞 Контакти
Якщо у вас є питання або ідеї, зв’яжіться зі мною:

✉ Email: evgen1sider@gmail.com
🐙 GitHub: evgen1sider
