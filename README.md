# TrustGraph AI 

> **AI-powered supply chain risk intelligence platform for Indian MSMEs**

![TrustGraph AI Banner](screenshots/hero.png)

TrustGraph AI helps Micro, Small & Medium Enterprises (MSMEs) in India predict and prevent supply chain disruptions before they happen. Using AI-driven analysis of financial health, delivery performance, and payment behavior, TrustGraph assigns real-time **Trust Scores** to every supplier — giving you early warning when a link in your chain is about to break.

---

## 🎯 Live Demo

**Frontend:** https://trustgraph-ai.vercel.app  
**Login:** `admin@trustgraph.com` / `password123`

---

## ✨ Features

| Feature | Description |
|---|---|
| **Supplier Trust Scores** | AI-computed scores (0-100) per supplier based on 500+ data points |
| **Interactive Network Graph** | Visualize deep-tier supply chain relationships as a live D3-powered node graph |
| **Animated Dashboard** | Scrollable hero page with animated stats, risk distribution charts, and supplier cards |
| **Slide-out Detail Panel** | Flying-in panel with trust score ring, operational metrics, AI insights, and activity timeline |
| **CRUD Operations** | Add, edit, and delete suppliers with real-time feedback toasts |
| **Downloadable Reports** | Generate and download HTML supplier reports with full analytics |
| **Share Functionality** | Web Share API integration for sharing supplier insights |
| **Responsive Design** | Mobile-first with translucent glassmorphism effects and particle backgrounds |
| **3D Login Page** | Scroll-interactive 3D transform effects on login |
| **Particle Backgrounds** | Animated particles.js backgrounds on all pages |
| **Authentication** | Login system with simulated user validation |
| **Smooth Navigation** | Single-page scroll with smooth section navigation |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI |
| **Vite 5** | Dev server & build tool |
| **TailwindCSS 3** | Utility-first styling with glassmorphism |
| **React Router DOM** | Client-side routing |
| **D3.js** | Interactive network graph visualization |
| **particles.js** | Animated background effects |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **SQLite 3** | Embedded relational database |
| **CORS** | Cross-origin request handling |

---

## 📁 Project Structure

```
MSME HACKATHON/
├── src/
│   ├── App.jsx                   # Main application shell & routing
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles, animations & design tokens
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page with hero section
│   │   ├── LoginPage.jsx         # 3D animated login page
│   │   └── DashboardPage.jsx     # Single scrollable page with all sections
│   ├── components/
│   │   ├── Layout.jsx            # Main layout with nav, particles & footer
│   │   ├── RequireAuth.jsx       # Protected route wrapper
│   │   ├── ToastAlert.jsx        # Toast notification component
│   │   └── ui/
│   │       ├── particles-bg.jsx   # Animated particle background
│   │       └── Web3Background.jsx # Alternative web3 background
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state management
│   │   └── ToastContext.jsx       # Toast notification state
│   ├── SupplierModal.jsx         # Add / Edit supplier modal
│   ├── SupplierDetailPanel.jsx   # Flying slide-out analytics panel
│   └── NetworkGraph.jsx          # D3-powered interactive network graph
│
├── backend/
│   ├── server.js                 # Express REST API (port 3000)
│   ├── database.js               # SQLite connection, schema & seed data
│   └── trustgraph.db             # SQLite database file
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── tailwind.config.js           # Tailwind design tokens
└── package.json                  # Frontend dependencies & scripts
```

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*3D animated login page with translucent particle background*

### Dashboard - Trust Score Cards
![Trust Scores](screenshots/dashboard-cards.png)
*Animated supplier trust score cards with glassmorphism effects*

### Dashboard - Network Graph
![Network Graph](screenshots/network-graph.png)
*Interactive D3-powered supply chain network visualization*

### Dashboard - Risk Distribution
![Risk Distribution](screenshots/risk-distribution.png)
*Animated bar chart showing risk distribution across suppliers*

### Supplier Detail Panel
![Supplier Detail](screenshots/supplier-detail.png)
*Flying slide-out panel with trust score ring and AI insights*

### How It Works Section
![How It Works](screenshots/how-it-works.png)
*3-step process with animated cards*

---

## 🗄️ Database Schema

```sql
-- Supplier trust records
CREATE TABLE suppliers (
  id                  TEXT PRIMARY KEY,
  name                TEXT,
  industry            TEXT,
  score               INTEGER,       -- Trust score 0-100
  risk                TEXT,          -- Risk label
  riskIcon            TEXT,          -- Material icon name
  riskColor           TEXT,          -- Tailwind color class
  insight             TEXT,          -- AI-generated insight
  paymentDelay        TEXT,          -- Avg payment delay
  deliveryReliability TEXT,          -- Delivery % on time
  qualityRate         TEXT,          -- Quality acceptance %
  complaintCount      INTEGER        -- Open complaints count
);

-- Platform headline statistics
CREATE TABLE stats (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  value TEXT,
  label TEXT,
  icon  TEXT
);

-- Network visualization nodes
CREATE TABLE network_nodes (
  id    INTEGER PRIMARY KEY,
  label TEXT,
  x     INTEGER,
  y     INTEGER,
  score INTEGER,
  size  INTEGER
);

-- Network visualization edges
CREATE TABLE network_edges (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  fromId INTEGER,
  toId   INTEGER
);

-- User accounts
CREATE TABLE users (
  id       INTEGER PRIMARY KEY,
  email    TEXT,
  password TEXT
);
```

---

## 🔌 API Reference

Base URL: `http://localhost:3000`

### Suppliers

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/suppliers` | Fetch all suppliers with full details |
| `POST` | `/api/suppliers` | Create a new supplier |
| `PUT` | `/api/suppliers/:id` | Update an existing supplier |
| `DELETE` | `/api/suppliers/:id` | Remove a supplier |

### Dashboard & Network

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Fetch headline platform statistics |
| `GET` | `/api/network` | Fetch nodes & edges for the network graph |

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/login` | `{ email, password }` | Authenticate a user |

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### 1. Clone the Repository

```bash
git clone https://github.com/cksakthiram2428/TrustGraph-AI.git
cd TrustGraph-AI
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Start the Backend Server

```bash
cd backend
node server.js
```

> The API server starts at **http://localhost:3000** and auto-seeds the SQLite database on first run.

### 5. Start the Frontend Dev Server

```bash
npm run dev
```

> The frontend starts at **http://localhost:5173** (or next available port).

### Default Login Credentials

- **Email:** `admin@trustgraph.com`
- **Password:** `password123`

---

## 🎯 Risk Score System

Trust Scores are calculated from four primary KPIs:

| KPI | Weight | Description |
|---|---|---|
| Payment Delay | High | Average days to settle invoices |
| Delivery Reliability | High | % of orders delivered on time |
| Quality Rate | Medium | % of goods passing quality control |
| Complaint Count | Medium | Number of open / unresolved complaints |

### Score Thresholds

```
≥ 80  →  🟢 Very Low / Low Risk   — Healthy, reliable partner
50–79 →  🟡 Medium Risk           — Monitor closely
< 50  →  🔴 High / Critical Risk  — Immediate action recommended
```

---

## 🌱 Pre-Seeded Demo Data

The database is seeded with five representative suppliers out of the box:

| Supplier | Industry | Score | Risk |
|---|---|---|---|
| Rajesh Textiles Pvt Ltd | Textiles & Apparel | 91 | Very Low Risk |
| Mehta Electronics Corp | Electronics & Components | 43 | High Risk |
| Gupta Food Processing | Food & Beverages | 78 | Low Risk |
| Sharma Logistics Hub | Logistics & Warehousing | 61 | Medium Risk |
| Patel Pharma Solutions | Pharmaceuticals | 29 | Critical Risk |

---

## 🏆 Hackathon Context

This project was built for an **MSME-focused Hackathon**, addressing a real challenge faced by thousands of small businesses in India: **blind spots in their supply chain**. A single financially-distressed supplier can cascade into production halts, cash flow crises, and lost customers.

**TrustGraph AI** solves this by:

- Aggregating multi-source financial and operational data
- Modeling supplier relationships as a knowledge graph
- Surfacing actionable risk signals proactively — before disruption hits

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

Built for hackathon / demo purposes. All rights reserved © 2026 TrustGraph AI.