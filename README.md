# 🌿 GoFarm — E-Commerce Platform

A full-stack e-commerce web application for organic farm products, built with **Next.js 16**, **React 19**, **TypeScript**, **TailwindCSS 4**, and **MySQL**.

> **Course:** Internet & Web Services (61FIT3IWS) — Spring 2026  
> **Group:** 19

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16 (App Router), TailwindCSS 4, Framer Motion |
| **Backend** | Next.js API Routes (RESTful), Node.js |
| **Database** | MySQL 8+ via `mysql2/promise` (connection pooling) |
| **Authentication** | Custom JWT (HMAC-SHA256), PBKDF2 password hashing (120K iterations) |
| **Security** | Rate limiting, CORS, CSP, HSTS, XSS sanitization |
| **Language** | TypeScript 5.9 (strict mode) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8.0
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Chipboy0727/IWS_Ecommerce_Gofarm.git
cd IWS_Ecommerce_Gofarm

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gofarm;"

# 5. Start the development server
npm run dev
```

The application will be available at **http://localhost:3000**.

> On first startup, the database schema is automatically created and seeded with sample data.

---

## 📡 REST API Architecture

All API endpoints follow RESTful conventions with JSON request/response formatting.

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration with input validation |
| `POST` | `/api/auth/login` | User login with JWT token issuance |
| `POST` | `/api/auth/logout` | Session termination |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/auth/forgot-password` | Request password reset token |
| `POST` | `/api/auth/reset-password` | Reset password with token verification |

### Resource Endpoints (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (sorting, pagination, filtering) |
| `POST` | `/api/products` | Create product (admin only) |
| `GET` | `/api/products/:slug` | Get product by slug |
| `PATCH` | `/api/products/:slug` | Update product (admin only) |
| `DELETE` | `/api/products/:slug` | Delete product (admin only) |
| `GET` | `/api/orders` | List orders (sorting, pagination, filtering) |
| `POST` | `/api/orders` | Create order (authenticated) |
| `GET` | `/api/orders/:id` | Get order by ID |
| `PATCH` | `/api/orders/:id` | Update order status |
| `DELETE` | `/api/orders/:id` | Delete order |
| `GET` | `/api/users` | List users (admin only) |
| `POST` | `/api/users` | Create user (admin only) |
| `PUT` | `/api/users/:id` | Update user (admin only) |
| `DELETE` | `/api/users/:id` | Delete user (admin only) |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/stores` | List stores |

### Query Parameters (Sorting, Pagination, Filtering)

```
GET /api/products?page=1&limit=12&sortBy=price&sortOrder=asc&search=organic&category=vegetables&minPrice=5&maxPrice=50
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `sortBy` | string | Sort field (e.g., `name`, `price`, `rating`, `createdAt`) |
| `sortOrder` | string | `asc` or `desc` |
| `search` | string | Full-text search |
| `category` | string | Filter by category |
| `brand` | string | Filter by brand |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `status` | string | Filter by status |

---

## 🔒 Security Implementation (OWASP Top 10)

| OWASP ID | Vulnerability | Mitigation |
|----------|--------------|------------|
| **A01:2021** | Broken Access Control | JWT-based authentication, role-based authorization (`requireAdmin`), admin route protection in middleware |
| **A02:2021** | Cryptographic Failures | PBKDF2-SHA256 (120K iterations) with random salt, timing-safe password comparison, HMAC-SHA256 JWT signing |
| **A03:2021** | Injection | Parameterized SQL queries (prepared statements), HTML sanitization, input validation |
| **A05:2021** | Security Misconfiguration | Strict CORS policy, Content Security Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options |
| **A07:2021** | Auth Failures | Rate limiting (100 req/min API, 20 req/min auth), HttpOnly + SameSite cookies, token expiry |

### Rate Limiting

- **API routes:** 100 requests per minute per IP (sliding window)
- **Auth routes:** 20 requests per minute per IP (brute-force protection)
- Returns `429 Too Many Requests` with `Retry-After` header

### Security Headers

Every response includes: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, and `Strict-Transport-Security` (production).

---

## 📁 Project Structure

```
├── app/
│   ├── api/              # REST API route handlers
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD
│   │   ├── orders/       # Order CRUD
│   │   ├── users/        # User management (admin)
│   │   ├── categories/   # Category listing
│   │   └── stores/       # Store listing
│   ├── admin/            # Admin dashboard pages
│   ├── shop/             # Shop browsing page
│   ├── collection/       # Product collection page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── context/          # React context providers
├── components/           # Reusable UI components
├── lib/
│   └── backend/          # Server-side utilities
│       ├── auth.ts       # JWT & password hashing
│       ├── db.ts         # Database access layer (MySQL)
│       ├── rate-limit.ts # Sliding-window rate limiter
│       ├── session.ts    # Session management
│       └── http.ts       # Request/response helpers
├── middleware.ts         # Edge middleware (rate limiting, security headers, auth)
├── database-seed.sql     # Database seed data
└── next.config.mjs       # Next.js configuration (CORS, security headers)
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Webpack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:ensure` | Ensure MySQL database exists |

---

## 📄 License

This project is developed as a coursework submission for the Internet & Web Services course at FPT University.
