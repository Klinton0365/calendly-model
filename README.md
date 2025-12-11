# Mini Calendly-style Scheduler

A lean appointment scheduling app built as part of a PHP Developer challenge.

Tech stack:
- Backend: PHP (Laravel)
- Frontend: React + Vite
- DB: MySQL

---

## Project structure

- `backend/` – Laravel API (availability + bookings)
- `frontend/` – React single-page app

---

## Setup

### Backend

1. `cd backend`
2. `cp .env.example .env` and set your DB credentials
3. `composer install`
4. `php artisan key:generate`
5. `php artisan migrate`
6. (Optional) create a default user:

   ```bash
   php artisan tinker
   >>> \App\Models\User::create(['name' => 'Host', 'email' => 'host@example.com']);
