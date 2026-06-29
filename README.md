# ⚖️ LegalEase – Online Lawyer Hiring Platform

A full-stack **MERN + Next.js** web application that connects legal seekers and businesses with verified lawyers through a secure, streamlined digital marketplace.

---

## 🌐 Live URL
🔗 https://legalease-pearl-eta.vercel.app
---

## 🎯 Purpose

Traditional legal hiring is limited to law firms and physical consultations. **LegalEase** democratizes access to legal aid by providing an online marketplace where clients can browse, discover, and hire legal experts — and lawyers can reach a global audience after a simple one-time verification.

---

## 🚀 Key Features

### 👤 Authentication
- Email/Password registration & login
- Google OAuth login via **BetterAuth**
- JWT token issued after login (expires in 7 days)
- Role selection after registration: **User (Client)** or **Lawyer**
- Protected routes with JWT token verification

### 🏠 Home Page
- Hero banner with CTA — *"Find & Hire Expert Legal Counsel"*
- Featured Lawyers section (latest 6 from DB)
- Top 3 Legal Experts (by total hires)
- Legal Categories grid (Criminal, Corporate, Family, etc.)
- Framer Motion animations (fade-in, staggered scroll reveal, hover effects)

### 🔍 Browse Lawyers
- Public access — no login required to browse
- Responsive grid layout (2/3/4 columns for mobile/tablet/desktop)
- Search by name or specialization
- Filter by fee range and availability
- Skeleton loaders & friendly empty states
- Pagination (6–12 lawyers per page)

### 📋 Lawyer Details Page
- Full lawyer profile: photo, name, specialization, bio, fee, status, date joined
- **Hire** via modal (authenticated users only)
- **Comment** section (only for users who have hired this lawyer)
- Skeleton loader while fetching

### 📊 Dashboards (Role-Based)

#### 🧑 User Dashboard
- View & update profile (name, photo)
- Hiring History — see request status (Pending / Accepted / Rejected)
- Pay lawyer fee via **Stripe** after acceptance
- Manage own comments (edit/delete)

#### ⚖️ Lawyer Dashboard
- Manage incoming hiring requests (Accept / Reject)
- Manage legal profile/services (name, bio, fee, specialization, image)
- View hiring case history

#### 🛡️ Admin Dashboard
- Manage all users (view, change role, delete)
- View all transactions (ID, email, amount, date)
- Analytics overview (total users, lawyers, hires, revenue)

### 💳 Payment System
- **Stripe** integration for lawyer hiring fees
- Transaction history for users, lawyers, and admin
- Pay button disabled with "Paid" label after successful payment

### 🖼️ Image Upload
- Lawyer photos uploaded via **imgBB API**
---
## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS v4 |
| Backend | Next.js API Routes, Node.js |
| Database | MongoDB (official `mongodb` driver) |
| Auth | BetterAuth + Google OAuth + JWT |
| Payments | Stripe |
| Image Hosting | imgBB API |
| Animations | Framer Motion |
| UI Components | HeroUI, Gravity UI |
| Deployment | Vercel |
--
## 📦 NPM Packages Used

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^16.2.9 | Full-stack React framework (App Router) |
| `react` | 19.2.4 | Core UI library |
| `react-dom` | 19.2.4 | React DOM rendering |
| `better-auth` | ^1.6.19 | Authentication (email/password + Google OAuth) |
| `@better-auth/mongo-adapter` | ^1.6.19 | BetterAuth adapter for MongoDB |
| `mongodb` | ^7.3.0 | MongoDB Node.js driver |
| `stripe` | ^22.3.0 | Stripe payment processing (server-side) |
| `@stripe/stripe-js` | ^9.8.0 | Stripe payment UI (client-side) |
| `framer-motion` | ^12.40.0 | Animations & transitions |
| `@heroui/react` | ^3.2.1 | UI component library |
| `@heroui/styles` | ^3.2.1 | HeroUI styles |
| `@gravity-ui/uikit` | ^7.42.0 | Additional UI components |
| `swiper` | ^12.2.0 | Hero banner slider/carousel |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-icons` | ^5.6.0 | Icon library |



## 👤 Admin Credentials

| Field | Value |
|-------|-------|
| Email | nextadmin@gmail.com |
| Password | 12345678 |


## 🧑‍💻 Developer

Made with ❤️ as part of an advanced MERN + Next.js full-stack project demonstrating role-based access control, Stripe payment integration, BetterAuth OAuth, JWT token security, and real-world full-stack architecture.
