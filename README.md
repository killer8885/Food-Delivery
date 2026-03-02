# Food Delivery Platform (Swiggy-style MERN)

Production-ready, scalable MERN architecture for a food delivery system with JWT auth, role-based access, Razorpay, Redis caching, Cloudinary uploads, Socket.io real-time tracking, and analytics.

## 1) Complete Folder Structure

```text
Food-Delivery/
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── cart/
│       │   ├── delivery/
│       │   ├── order/
│       │   ├── payment/
│       │   └── restaurant/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── customer/
│       │   └── delivery/
│       ├── routes/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── README.md
```

## 2) Backend + 3) Frontend + 4) Models
Implemented in `backend/src` and `frontend/src` (modular MVC + feature modules).

## 5) API Endpoint Documentation

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Restaurants/Menu/Ratings
- `GET /api/v1/restaurants`
- `POST /api/v1/restaurants` (ADMIN)
- `POST /api/v1/restaurants/menu` (OWNER/ADMIN)
- `PUT /api/v1/restaurants/menu/:id` (OWNER/ADMIN)
- `DELETE /api/v1/restaurants/menu/:id` (OWNER/ADMIN)
- `POST /api/v1/restaurants/:id/rate` (USER)

### Cart & Checkout
- `GET /api/v1/cart` (USER)
- `POST /api/v1/cart/items` (USER)
- `POST /api/v1/cart/coupon` (USER)

### Orders
- `POST /api/v1/orders` (USER)
- `PATCH /api/v1/orders/:id/status` (OWNER/ADMIN/DELIVERY_PARTNER)
- `POST /api/v1/orders/assign-delivery` (ADMIN)
- `POST /api/v1/orders/:id/cancel` (USER/ADMIN)

### Payments (Razorpay)
- `POST /api/v1/payments/create-order`
- `POST /api/v1/payments/verify`
- `POST /api/v1/payments/webhook`
- `POST /api/v1/payments/refund/:id`

### Delivery Partner
- `GET /api/v1/delivery/orders`
- `POST /api/v1/delivery/orders/:id/accept`
- `POST /api/v1/delivery/orders/:id/reject`
- `POST /api/v1/delivery/location`
- `GET /api/v1/delivery/earnings`

### Admin Analytics
- `GET /api/v1/admin/analytics`

## 6) Payment Integration
- Razorpay order creation before checkout confirmation.
- Signature verification API using HMAC SHA256.
- Webhook endpoint with signature verification.
- Refund API using Razorpay refund endpoint.
- Payment transaction logging in MongoDB.

## 7) Real-time Socket Implementation
- Socket rooms: `order:<orderId>` and `user:<userId>`.
- Events: `new-order`, `order-status-updated`, `user-order-updated`.

## 8) Deployment Guide (Vercel + Render)

### Backend on Render
1. Create Web Service from `backend` folder.
2. Set build command: `npm install`.
3. Start command: `npm start`.
4. Add environment variables from section below.
5. Allow inbound webhook to `/api/v1/payments/webhook`.

### Frontend on Vercel
1. Import repository and set root directory to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Set `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.

## 9) Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
REDIS_URL=redis://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## Run locally

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```
