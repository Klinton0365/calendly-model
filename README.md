# 📅 Mini Calendly-Style Scheduling Application

A lean appointment-scheduling application inspired by Calendly, built as part of a PHP Developer technical evaluation. The focus of this project is core scheduling functionality, clean data modeling, and a smooth, intuitive user experience within a limited time frame.

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | PHP (Laravel 12) |
| **Frontend** | React (Vite) |
| **Database** | MySQL |
| **Authentication** | Laravel Sanctum + Google OAuth (Socialite) |
| **Email** | SMTP (Gmail / Mailtrap) |
| **UI** | Custom CSS (Calendly-inspired, mobile-friendly) |

## 📁 Project Structure
```
.
├── backend/    # Laravel REST API
└── frontend/   # React single-page application
```

## ✨ Features Overview

### 🎯 Scheduling (Core Requirements)

- ✅ Weekly availability configuration (Calendly-style)
- ✅ Dynamic time-slot generation
- ✅ Booking creation with validation
- ✅ Prevention of double-booking (DB constraints + transactions)
- ✅ Persistent storage using MySQL

### 👥 Frontend (Visitor Experience)

- 📆 Calendar-based date selection
- 🕐 View available vs booked time slots
- 📝 Enter name/email and confirm booking
- ✉️ Clear confirmation and friendly error messages
- 📱 Clean, minimal, mobile-friendly UI

### 🔧 Admin / Host Features

- ⚙️ Admin view to add, edit, and delete availability
- 💾 Auto-save availability updates (no submit button)
- 📊 Dashboard with sidebar navigation

### 🎁 Extras

- 📧 Email notification on successful booking
- 🔐 Google OAuth login
- 📱 Responsive layout

## 🗄️ Data Model Design

The data model mirrors how Calendly handles recurring availability and actual bookings.

### Users

Stores hosts and authenticated users.
```sql
users
├── id
├── name
├── email (unique)
├── password (nullable for Google login)
├── google_id (nullable)
└── timestamps
```

### Weekly Availability

Defines recurring weekly availability for a host.
```sql
weekly_availabilities
├── id
├── user_id (FK → users.id)
├── day_of_week (0–6, Sunday–Saturday)
├── start_time
├── end_time
└── timestamps
```

### Bookings

Represents confirmed meetings.
```sql
bookings
├── id
├── user_id (FK → users.id)   // host
├── visitor_name
├── visitor_email
├── date
├── start_time
├── end_time
└── timestamps
```

### 🔒 Constraints & Validation

- ✅ One booking per host, date, and start time
- ✅ Booking must fall within defined availability
- ✅ Transactions and locking prevent race conditions

## 🌐 Backend API

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | User registration |
| `POST` | `/api/login` | User login |
| `GET` | `/api/user` | Get authenticated user |
| `GET` | `/api/auth/google/redirect` | Initiate Google OAuth |
| `GET` | `/api/auth/google/callback` | Handle Google OAuth callback |

### Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/weekly` | Get weekly availability |
| `POST` | `/api/admin/weekly/save` | Save weekly availability |
| `DELETE` | `/api/admin/weekly/{id}` | Delete availability slot |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/availability` | Get available time slots |
| `POST` | `/api/bookings` | Create a new booking |

## 🛠️ Installation & Running

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=UserSeeder
php artisan serve
```

**Configure database and mail credentials in `.env`**

Backend runs at: **http://localhost:8000**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## 📧 Email Configuration

Booking confirmation emails are sent via SMTP.

Required `.env` configuration:
```env

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback





CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@example.com
MAIL_FROM_NAME="MiniCalendly"
```
- ** ⚠️ Security Note **
- Never commit real credentials. All secrets must be stored in `.env`, which is ignored by Git.

## 🤖 AI Tools & Libraries Used

- **ChatGPT** – Assisted with architecture discussions, edge-case handling, Laravel 12 configuration nuances, and UX improvements
- **Claude** – Helped with code optimization, debugging, frontend component design, and implementation best practices
- **Laravel Framework** – Backend structure and security
- **React + Vite** – Fast and clean frontend development
- **Laravel Socialite** – Google OAuth integration

*AI tools were used as development assistance, while all design decisions and implementation logic were consciously reviewed and applied.*

## 📝 Commit History

The repository contains a clear, incremental commit history demonstrating:

- ✅ Data model design
- ✅ Backend API development
- ✅ Frontend scheduling flow
- ✅ Admin availability management
- ✅ Authentication and email integration
- ✅ UI and UX polish

## 🎯 Summary

This project delivers a working Calendly-style scheduling flow with strong emphasis on:

- ✅ **Correct data modeling**
- ✅ **Robust backend validation**
- ✅ **Clean and intuitive user experience**
- ✅ **Practical time-boxed implementation**

It focuses on essentials first, while remaining extensible for future enhancements.

### Booking Flow
*Calendar view with available time slots*

### Admin Dashboard
*Manage weekly availability*

### Email Confirmation
*Booking confirmation email*

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Developer

**Klinton A**

- Email: klinton.developer365@gmail.com
- GitHub: [@klinton](https://github.com/Klinton0365)

---
