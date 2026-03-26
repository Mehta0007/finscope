
# FinScope

A full-stack finance tracking system designed to help users manage, analyze, and understand their financial activity with a clean and secure architecture.

---

## 🚀 Features

* Secure authentication using Clerk
* User-specific financial data tracking
* Full-stack architecture (client + server)
* Scalable project structure for real-world applications

---

## 🛠 Tech Stack

**Client**

* React (Vite)
* Clerk Authentication

**Server**

* Node.js (Express)

---

## 🧱 Architecture

This project follows a monorepo-style structure:

* `/client` → Frontend (UI, auth, interaction)
* `/server` → Backend (API, business logic, data handling)

Authentication is handled via Clerk on the frontend and validated on the backend using secure tokens.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mehta0007/finscope.git
cd finscope
```

### 2. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Setup environment variables

Create `.env` files in both `client` and `server` directories.

Example:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_key
```

### 4. Run the project

```bash
npm run dev
```

---

## 📌 Note

This project is actively being developed and improved with a focus on backend architecture, authentication systems, and scalable design.
