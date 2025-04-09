# CsaposApp 🍻

**Digitális platform vendéglátóegységek részére – asztalfoglalás, rendeléskezelés, POS rendszer egyben.**

---

## 📌 Projekt leírása

A **CsaposApp** egy vendéglátóhelyek (elsősorban kocsmák) mindennapi működését támogató digitális rendszer, amely megkönnyíti az **asztalfoglalás**, **rendeléskezelés**, és **vendégkommunikáció** folyamatát.

A rendszer egy webalkalmazásból, egy asztali POS rendszerből, és egy valós idejű kommunikációt biztosító backendből áll. Teljes mértékben mobilra optimalizált, bővíthető és skálázható megoldás, amely a papíralapú és szóbeli rendeléskezelés helyett modern, gyors és megbízható élményt biztosít.

---

## 👨‍💻 Fejlesztők

- **Ágoston Attila** – Frontend, webes felület, asztali alkalmazás
- **Lőrincz Loránd László** – Backend, adatbázis, szerveroldal

**Konzulens:** Kasza László Róbert  
**Intézmény:** Miskolci SZC Kandó Kálmán Informatikai Technikum  
**Szak:** Szoftverfejlesztő- és tesztelő szak  
**Év:** 2024 - 2025

---

## 🧱 Technológiák

### 💾 Adatbázis
- **MySQL** – relációs adatbázis
- **phpMyAdmin** – webes kezelőfelület

### 🖥️ Backend
- **ASP.NET** (.NET 8)
- **C#**
- **Entity Framework** (ORM)
- **SignalR** – valós idejű kommunikáció
- **Swagger** – REST API dokumentáció

### 🌐 Frontend
- **React**
- **TailwindCSS**
- **JavaScript**, **HTML**, **CSS**

### 💻 Asztali alkalmazás
- **Electron**
- **React**, **HTML**, **CSS**, **JS**

### ⚙️ Szerver és DevOps
- **Docker**
- **Docker Compose**
- **Caddy** (reverse proxy + HTTPS)
- **Cloudflare**
- **No-IP** (dinamikus DNS)

### 🛠️ Verziókezelés
- **Git**
- **GitHub** → [https://github.com/Solmyr77/CsaposApp](https://github.com/Solmyr77/CsaposApp)

---

## 📋 Fejlesztői környezetek

- **Visual Studio 2022** – Backend fejlesztés
- **Visual Studio Code** – Frontend és Electron alkalmazás fejlesztés

---

## 🌐 Használt kommunikációs eszközök

- **Discord** – Napi kapcsolattartás
- **Trello** → [CsaposApp Trello tábla](https://trello.com/b/36hRnRs1/csaposapp)
- **GitHub Issues** – Feladatkövetés, hibakezelés

---

## 🚀 Funkciók

### ✅ Felhasználói oldal
- Regisztráció / bejelentkezés (18+ korhatár, jelszóellenőrzés)
- Mobilbarát weboldal
- Vendéglátóhelyek böngészése, szűrés
- Asztalfoglalás (7 napra előre, 15 perces bontás)
- Barátmeghívás foglaláskor
- Rendelésleadás a kocsma kínálatából (kategóriánként)
- Foglalásaim / Rendeléseim szekció
- Foglalás lemondása
- Valós idejű frissítés SignalR-rel
- Profilkezelés, jelszómódosítás

### 🍽️ Asztali alkalmazás (POS)
- Érkező foglalások megjelenítése
- Aktív rendelések kezelése
- Felhasználói rendelési státuszok nyomon követése

---

## 🔐 Backend API

Interaktív dokumentáció:  
📎 [Swagger UI](https://backend.csaposapp.hu/swagger/index.html)

### 🔧 Kiemelt API modulok

#### `Booking API` – Asztalfoglalás
- Foglalás létrehozása / lekérdezése / törlése
- Meghívás elfogadás / visszautasítás
- Foglalás állapotváltozások lekérdezése valós időben

#### `Products API` – Termékkínálat
- Termékek CRUD műveletei
- Vendéglátóhely-specifikus menük

#### `Auth API` – Hitelesítés
- Regisztráció, bejelentkezés, kijelentkezés
- JWT token kezelés
- Jelszómódosítás

---

## 📦 Telepítés (fejlesztői környezet)

1. **Követelmények**:
   - Docker + Docker Compose
   - Visual Studio 2022 (backend fejlesztéshez)
   - Node.js + Yarn/NPM (frontendhez)
