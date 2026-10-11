# Laravel React CRUD – Note Management App

A CRUD application built with **Laravel (backend)**, **Inertia.js (middleware)**, and **React (frontend)**.  
This project demonstrates how to create, read, update, and delete **notes**, each associated with a specific user, in a modern single-page application.

## ✨ Features

- Built-in user authentication via Laravel Breeze
- Create, read, update, and delete personal notes
- Protected routes – users can only access their own notes
- Clean UI with dynamic React components
- Inertia.js-powered SPA experience
- Laravel API Resources for structured JSON responses

## 🛠 Tech Stack

- **Backend:** Laravel
- **Frontend:** React
- **SPA Middleware:** Inertia.js
- **Database:** MySQL
- **Styling:** Tailwind CSS

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- PHP >= 8.1
- Composer
- Node.js and npm
- MySQL or SQLite
- Laravel CLI

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/laravel-react-crud.git
cd laravel-react-crud
```

2. **Install PHP dependencies**

```bash
composer install
```

3. **Install JavaScript dependencies**

```bash
npm install
```

4. **Set up .env**

```bash
cp .env.example .env
```

Update database credentials in .env.

5. **Generate app key**

```bash
php artisan key:generate
```

6. **Run migrations**

```bash
php artisan migrate
```

7. **Run dev server**

```bash
npm run dev
php artisan serve
```

Visit http://localhost:8000

## 🧠 Usage

1. Register a new user.
2. Log in to your account.
3. Start creating, editing, and deleting your notes.
4. Each user can only view and manage their own notes.

---

## 📂 Folder Structure Highlights

- `resources/js/Pages` – React components for views
- `resources/js/Layouts` – Inertia page layouts
- `app/Http/Controllers` – Laravel controllers
- `app/Models/Note.php` – Eloquent model for notes
- `routes/web.php` – Web routes powered by Inertia

---

## 📌 TODO / Improvements

- Pagination and search for notes
- Rich text editor (optional)
- API versioning
- Unit & feature tests

---

## 📄 License

This project is open-sourced under the [MIT license](LICENSE).
