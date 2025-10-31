# Travel Experience Booking App

A **MERN-based Travel Booking Platform** where users can explore experiences, choose available time slots, apply **promo codes**, and complete checkout securely.
This project is divided into two parts — **Frontend (React + Tailwind)** and **Backend (Node.js + Express + MongoDB)**.

---

## Features

### Frontend

* Built using **React + TypeScript + TailwindCSS**
* Displays list of available **experiences**
* **Detail page** showing available slots (date/time)
* **Checkout page** with:

  * Promo code input and validation
  * Dynamic discount calculation
  * Total price update in real-time
* Fully responsive and user-friendly UI

### Backend

* **Express + MongoDB + Mongoose**
* Endpoints for:

  * Fetching experiences and details
  * Validating promo codes (`/promo/validate`)
  * Confirming bookings (`/bookings`)
  * Checkout process simulation (`/checkout`)
* MongoDB collections:

  * `experiences`
  * `slots`
  * `promocodes`
  * `bookings`
* Pre-seeded sample data for testing

---

## Folder Structure

```
project-root/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── global.css
    │   │   └── DetailPage/[id]/page.tsx
    |   |   └── CheckoutPage/page.tsx
    |   |   └── ResultPage/page.tsx
    |   |   └── Layout.tsx
    |   |   └── page.tsx
    |   |   └── LayoutWrapper.tsx
    │   ├── components/
    |   |   └── Header.tsx
    |   |   └── ExperienceCard.tsx
    ├── tailwind.config.js
    ├── package.json
    └── tsconfig.json
```

---

##  Backend Setup

###  Prerequisites

* Node.js v18+
* MongoDB
* npm 

### Environment Variables (`.env`)

```
MONGO_URL
PORT=5000
```

### Installation

```bash
cd backend
npm install
```

### Run Backend

```bash
npm start
```

Server runs at:
[http://localhost:5000]

---

## Backend API Routes

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| `GET`  | `/experiences`     | Get all available experiences      |
| `GET`  | `/experiences/:id` | Get specific experience by ID      |
| `POST` | `/promo/validate`  | Validate a promo code for discount |
| `POST` | `/bookings`        | Confirm a booking                  |

---

## Frontend Setup

### Prerequisites

* Node.js v18+
* npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend runs at:
[http://localhost:3000]

---

## Checkout Flow

1. User selects an experience and slot.
2. Enters promo code (e.g., `SAVE10`).
3. App sends `POST /promo/validate`.
4. Backend verifies promo and returns discount.
5. Total updates automatically.
6. On “Confirm Checkout and pay”, the frontend calls /resultPage.

---

## Tech Stack

**Frontend**

* React + TypeScript
* TailwindCSS v4+
* Fetch API 

**Backend**

* Node.js + Express
* MongoDB + Mongoose
* CORS & dotenv

---

## Example Request

### Validate Promo Code

```bash
POST http://localhost:5000/promo/validate
Content-Type: application/json

{
  "promoCode": "SAVE10",
  "experienceId": "64fa6b9a7b45d09cc92c4c30"
}
```

**Response**

```json
{
  "valid": true,
  "discountAmount": 10
}
```


## Testing the Flow

1. Start the backend:

   ```bash
   npm start
   ```
2. Start the frontend:

   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`
4. Choose an experience → Select slot → Checkout → Confirmation Page

---

## Author

**Prasannakumar Bogachandrapu**
Full Stack Developer | MERN Stack Enthusiast
bogachandrapu@gmail.com

