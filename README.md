<div align="center">

<img src="client/src/logo/Daraz-Logo.png" alt="Daraz" height="96" />

### Daraz — Full‑Stack E‑Commerce Demo

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=061a23)](https://react.dev) [![Express](https://img.shields.io/badge/Express.js-4-black?logo=express&logoColor=white)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-7-116149?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Node](https://img.shields.io/badge/Node.js-18-3c873a?logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

</div>

Build, browse, and manage products across customer, supplier, and manager workflows. This project showcases a modern MERN stack with clean UI using Mantine and Tailwind, server‑side JWT auth, and MongoDB data models for users, products, and orders.

### ✨ Highlights

- ✅ Multi‑role flows: customer, supplier, manager dashboards
- ✅ Product catalog, orders, ratings/feedback
- ✅ React 18 + React Router v6 + React Query
- ✅ Mantine UI + TailwindCSS styling
- ✅ Node/Express API with MongoDB (Mongoose)
- ✅ Ready local dev with hot reload (nodemon, CRA)

---

### 🚀 Quick Start

1) Clone and install

```bash
git clone <your-repo-url>
cd Daraz

# Backend
cd server && npm install

# Frontend (in a second terminal)
cd ../client && npm install
```

2) Configure environment for the API

Create `server/.env` with:

```bash
PORT=5000
MONG_URI=mongodb://127.0.0.1:27017/daraz
SECRET_KEY=changeme_super_secret
```

3) Configure the frontend API base URL

Edit `client/src/api.js` to point to your server (defaults to 5000):

```js
const api = "http://localhost:5000";
export default api;
```

4) Run the apps

```bash
# Backend
cd server
npm run dev
# → http://localhost:5000

# Frontend (new terminal)
cd client
npm start
# → http://localhost:3001
```

---

### 🧱 Tech Stack

- Frontend: React 18, React Router v6, Mantine, TailwindCSS, React Query, Axios
- Backend: Node.js, Express.js, Mongoose, JWT, bcrypt, CORS, dotenv
- Database: MongoDB

---

### 📁 Project Structure

```
Daraz/
  client/                # React app (CRA)
    src/
      pages/             # Home, Login, Signup
      components/        # UI components + dashboards
      api/               # REST API helpers
      contexts/          # Cart context
  server/                # Express API
    routes/              # user, product, order routers
    models/              # Mongoose models
    config/              # env/port/mongo config
    middleware/          # auth middleware (JWT)
```

---

### 🔐 Environment

Backend uses `server/config/index.js` to load:

- `PORT` (default 5000)
- `MONG_URI` (required)
- `SECRET_KEY` (required for JWT)

---

### 🧪 NPM Scripts

- Backend (`server/package.json`):
  - `npm run dev` — start with nodemon
  - `npm start` — start with node

- Frontend (`client/package.json`):
  - `npm start` — start CRA on port 3001
  - `npm run build` — production build
  - `npm test` — tests via react‑scripts

---

### 📡 API Overview

Base URL: `http://localhost:5000`

- `POST /user/signup` — create user (name, email, password, role)
- `POST /user/login` — login, returns JWT and user details
- `GET /user/list` — list all users
- `GET /user/customers` — list customers (auth)

- `POST /product/create` — create random demo product
- `POST /product/create-custom` — create product with body `{ supplierId, name, price }`
- `GET /product/list` — list products (auth)
- `GET /product/all` — list products (public)
- `DELETE /product/:productId` — delete a product

- `GET /order/list` — list all orders
- `POST /order/place` — create order (auth) `{ products, customerID, amount }`
- `PATCH /order/:orderId` — update order
- `GET /order/:orderId` — get order by id (auth)
- `DELETE /order/:orderId` — delete order
- `GET /order/customer-orders/:customerID` — orders by customer (auth)
- `GET /order/supplier-orders/:supplierID` — orders by supplier (auth)
- `POST /order/feedback` — set rating for a product in an order

Notes:

- Some routes are marked "auth" and are intended to require `Authorization: Bearer <token>`. The provided middleware stub currently allows all requests through for local development.

---

### 🖼️ UI Preview

<div align="center">
  <img src="client/src/components/Daraz-Logo.png" alt="Daraz UI" height="120" />
  <br/>
  <sub>Branding preview. Replace with app screenshots as you iterate.</sub>
  <br/><br/>
</div>

---

### 🧭 Development Tips

- Update `client/src/api.js` to match your backend port and host
- Ensure MongoDB is running locally at `MONG_URI`
- Use `GET /product/create` or `/product/create-random` to seed demo data

---

### 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue to discuss what you would like to change.

---
