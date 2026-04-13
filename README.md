
# FinScope

A full-stack personal finance tracker built with React, TypeScript, Node.js, and PostgreSQL. Authenticated via Clerk, it gives users a real-time view of their income, expenses, and spending trends — all in one clean, responsive dashboard.

---

## Features

- **Secure authentication** — Clerk-powered sign-up/sign-in with JWT verification on every API call
- **Transaction management** — Create, edit, and delete income/expense entries with category tagging
- **Live dashboard** — Net balance, total income, and total expense stats at a glance
- **Monthly overview** — Income vs. expense breakdown with visual progress bars for the active month
- **6-month cash flow chart** — Toggle between income and expense bars to spot trends quickly
- **Spending mix** — Category breakdown of all logged expenses, ranked by share
- **CSV export** — Download the full transaction history with one click
- **Dark / light theme** — System-aware toggle persisted across sessions
- **Fully responsive** — Mobile-first layout that scales cleanly to desktop

---

## Tech Stack

### Client

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Auth | Clerk (`@clerk/clerk-react`) |
| Animation | GSAP · Motion (Framer Motion) |
| Icons | Lucide React |

### Server

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express v5 |
| Database | PostgreSQL (`pg`) |
| Auth | Clerk SDK (`@clerk/clerk-sdk-node`) |
| Dev server | Nodemon |

---

## Project Structure

```
finance-tracker-app/
├── client/                     # React + TypeScript frontend
│   └── src/
│       ├── api/                # Axios/fetch wrappers per resource
│       ├── components/         # Shared UI components
│       │   └── transactions/   # TransactionForm, TransactionList
│       ├── hooks/              # TanStack Query hooks (CRUD)
│       ├── lib/                # Pure utility functions (formatting, analytics)
│       ├── pages/
│       │   ├── auth/           # Landing + auth page
│       │   └── dashboard/      # Main app dashboard
│       └── types/              # Shared TypeScript interfaces
│
└── server/                     # Express REST API
    └── src/
        ├── config/             # DB connection pool
        ├── controllers/        # Request handlers
        ├── middlewares/        # Auth (Clerk JWT) + input validation
        ├── routes/             # Route definitions
        └── services/           # DB query layer
```

---

## API Reference

All routes require a valid Clerk session token in the `Authorization` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Fetch all transactions for the authenticated user |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

**Transaction shape**

```json
{
  "id": "uuid",
  "type": "income | expense",
  "category": "string",
  "amount": 1500.00,
  "date": "2026-04-13",
  "description": "optional string"
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted — e.g. Supabase, Neon, Railway)
- A [Clerk](https://clerk.com) application (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/Mehta0007/finscope.git
cd finscope
```

### 2. Install dependencies

```bash
# Root (runs client + server concurrently)
npm install

# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Configure environment variables

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000
```

**`server/.env`**
```env
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:password@localhost:5432/finscope
PORT=5000
```

### 4. Set up the database

Run the following SQL to create the transactions table:

```sql
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category    TEXT NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL,
  date        DATE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Run the app

```bash
# From the project root — starts client + server together
npm run dev
```

| Service | URL |
|---|---|
| Client | `http://localhost:5173` |
| Server | `http://localhost:5000` |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start client and server concurrently |
| `npm run client` | Start the Vite dev server only |
| `npm run server` | Start the Express dev server only |
| `npm run build` (client) | TypeScript compile + Vite production build |
| `npm run lint` (client) | Run ESLint |

---

## Security

- Every API route is protected by Clerk's `authMiddleware`, which verifies the session JWT server-side before any data is returned or mutated.
- Input validation middleware (`validateTransaction`) rejects malformed payloads before they reach the controller layer.
- User data is strictly scoped — all queries filter by the authenticated `userId` extracted from the Clerk session, so users can never access another user's data.

---

## License

MIT
