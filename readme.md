# 🩸 Sweety — Blood Glucose Tracker

Sweety is a full-stack MERN (Node.js, Express, React, Vite) and PostgreSQL application engineered to help users log blood glucose levels across four designated daily slots, monitor statistical reports, visualize trends with Recharts, and receive live health recommendations.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite), JavaScript, Recharts, CSS
* **Backend:** Node.js, Express.js, JWT, bcrypt
* **Database & Cloud:** PostgreSQL (Hosted on Supabase)

---

## 📂 Project Structure

```text
sweety/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Dashboard, Charts, Recommendations, Auth
│   │   ├── services/       # Axios API client config
│   │   └── ...
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/    # Business logic for auth, readings & reports
│   │   ├── middleware/     # JWT verification
│   │   ├── routes/         # API endpoints
│   │   └── config/         # PostgreSQL connection pool with error safety
│   └── setup-db.js         # Automated schema migration & seed script
└── package.json            # Root workspace configuration

********************************************************************************************************************
********************************************************************************************************************


Here is your complete, unified **`README.md`** containing the project overview, file structure, installation steps, database setup, environment configuration, and running guide all in one block. You can copy and paste this directly into your root `README.md` file:

```markdown
# 🩸 Sweety — Blood Glucose Tracker

Sweety is a full-stack MERN (Node.js, Express, React, Vite) and PostgreSQL application engineered to help users log blood glucose levels across four designated daily slots, monitor statistical reports, visualize trends with Recharts, and receive live health recommendations.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite), JavaScript, Recharts, CSS
* **Backend:** Node.js, Express.js, JWT, bcrypt
* **Database & Cloud:** PostgreSQL (Hosted on Supabase)

---

## 📂 Project Structure

```text
sweety/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Dashboard, Charts, Recommendations, Auth
│   │   ├── services/       # Axios API client config
│   │   └── ...
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/    # Business logic for auth, readings & reports
│   │   ├── middleware/     # JWT verification
│   │   ├── routes/         # API endpoints
│   │   └── config/         # PostgreSQL connection pool with error safety
│   └── setup-db.js         # Automated schema migration & seed script
└── package.json            # Root workspace configuration

```

---

## ⚙️ Installation & Running Guide

### Step 1: Clone the Repository

```bash
git clone [https://github.com/your-username/sweety.git](https://github.com/your-username/sweety.git)
cd sweety

```

### Step 2: Install Dependencies

Install dependencies across the root, server, and client directories:

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..

```

### Step 3: Configure Environment Variables

Create a `.env` file inside your **`server/`** directory with the following variables (replace with your actual Supabase PostgreSQL connection string and secret):

```env
PORT=5000
DATABASE_URL=postgres://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_here

```

### Step 4: Initialize Database & Seed Demo User

Run the automated database setup script from the server directory to create tables, custom enums, unique indexes, and the demo user:

```bash
cd server
npm run setup
cd ..

```

* **Demo User Credentials:**
* **Email:** `demo@sweety.com`
* **Password:** `password123`



### Step 5: Run the Prototype Concurrently

From the root workspace directory, start both the backend server (port `5000`) and the frontend Vite development server (port `5173`) simultaneously:

```bash
npm run dev

```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📋 Core Features & Validations

1. **Authentication:** Secure signup and login with hashed passwords (`bcrypt`). Strict user data isolation (`user_id`).
2. **Readings Management:**
* Tracks 4 daily slots: `Morning (fasting)`, `After breakfast`, `After lunch`, `After dinner`.
* **Robust Validations:** Glucose value range (40–600 mg/dL), unique slot constraints per day, max 4 readings per day limit, and future date prevention.


3. **Statistical Reports & Insights:**
* **Daily, Month-to-Date (MTD), and Previous Month** reporting calculations (count, average rounded to 1 decimal, lowest, highest).
* **Interactive Recharts Trend Line:** Visualizes monthly glucose patterns with high-target reference lines.
* **Dynamic Health Recommendations:** Evaluates averages in real-time to provide personalized guidance.



---

## 📝 Notes & Assumptions

* **Timezone Safety:** Date comparisons use `YYYY-MM-DD` string parsing to prevent offset mismatches between client local time and cloud server time.
* **Database Constraints:** PostgreSQL native `ENUM` types and compound unique indexes (`user_id`, `date`, `slot`) guarantee strict data integrity at the database layer.

```

```