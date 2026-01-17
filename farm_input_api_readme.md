# 🌱 FarmInput API

FarmInput is a backend API powering a digital farm input planning, tracking, and pricing platform. It enables farmers to plan seasonal inputs, log purchases, track spending, receive price alerts, and interact with suppliers and groups.

This README is designed for **backend maintainers**, **frontend developers**, and **API consumers**.

---

## 📦 Tech Stack

- **Node.js + Express** – API server
- **MongoDB + Mongoose** – Database & ODM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Nodemailer** – Email notifications
- **Postman** – API testing

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-org/farminput-api.git
cd farminput-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Environment variables
Create a `.env` file:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/farminput
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=example@gmail.com
EMAIL_PASS=app_password
```

### 4️⃣ Start the server
```bash
npm run dev
```

Server will run on:
```
http://localhost:4000
```

---

## 🔐 Authentication

All protected routes require a **Bearer token**:
```
Authorization: Bearer <JWT_TOKEN>
```

Token is returned from:
- `POST /api/auth/signup`
- `POST /api/auth/login`

---

## 📘 API Documentation

A **complete, frontend-ready API reference** (with request & response examples) is available as a PDF:

📄 **FarmInput_API_Documentation_Full_With_Examples_v2.pdf**

This document covers:
- Auth (signup, login, password reset)
- User & profile
- Farm management
- Groups & chat
- Inputs & input logs
- Spending & reports
- Planning & forecasts
- Pricing & alerts
- Suppliers & reviews
- Verification flows

👉 Frontend teams should rely on the PDF as the **source of truth**.

---

## 🧩 API Modules Overview

### 🔑 Auth
- Signup & login
- Password reset (email-based)
- JWT-based authentication

### 👤 Users & Profiles
- User profile retrieval & updates
- Role-based access (farmer, supplier, admin)

### 🌾 Farm
- Farm creation & update
- Farm size, crops, and location tracking

### 📦 Inputs
- Input categories
- Input catalog
- Supplier listing

### 🧾 Input Logs
- Log farm input purchases
- Edit & delete logs
- Auto-linked spending transactions

### 💰 Spending & Reports
- Spending summaries
- Category breakdowns
- Trend comparisons

### 📊 Planning & Forecasts
- Seasonal input estimation
- Cost forecasting

### 📈 Pricing & Alerts
- Market price tracking
- Price alert triggers

### 🏪 Suppliers & Reviews
- Supplier search by location
- Ratings & reviews

### 💬 Groups & Chat
- Farmer groups
- Messaging (extensible)

### ✅ Verification
- Account verification
- Supplier validation

---

## 🧪 Testing

### Postman
- Import the provided Postman collection
- Set environment variables:
  - `baseUrl`
  - `token`

### Common Errors
| Error | Meaning |
|-----|--------|
| 400 | Missing or invalid fields |
| 401 | Missing / invalid token |
| 404 | Resource not found |
| 500 | Server error |

---

## 🛠 Development Notes

- All `ObjectId` fields must be valid MongoDB IDs
- Ensure `Content-Type: application/json` on POST/PUT requests
- `req.user` is injected via auth middleware

---


## 📄 License

TECHCRUSH License

---

## 🤝 Contributors

Built as part of a capstone project focused on:
- Agritech
- Financial visibility for farmers
- Data-driven farm planning

---
