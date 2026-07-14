# Nexus — Admin Dashboard

A modern, responsive analytics & admin dashboard built with **React 19 + TypeScript + Vite**, with charts powered by **Recharts** and a mock REST backend powered by **json-server**.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logoColor=white)

## Features

- **Dynamic dashboard (Home)** — KPI stat cards, an area chart (revenue), bar chart (weekly orders), donut (sales by category), line chart (orders vs customers) and a recent-orders table. All data is fetched live from the backend.
- **Clients** — full CRUD (create / edit / delete) with search, status filter, pagination and form validation.
- **Products** — full CRUD with search, category filter, pagination; stock status (In / Low / Out of Stock) derived automatically.
- **Orders** — full CRUD with search, status filter and pagination; stays in sync with the dashboard's recent orders.
- **About / Contact** — static info pages.
- **Responsive** — works on desktop and mobile (collapsible drawer sidebar on small screens).
- **Polished UX** — reusable UI kit (cards, buttons, inputs, status pills, toasts, skeleton loaders), loading / error / empty states, and toast notifications.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Charts | Recharts |
| Icons | react-icons |
| Mock API | json-server (`db.json`) |
| Styling | Inline styles + a shared theme token module |

## Getting started

This project needs **two processes running at the same time**: the Vite dev server and the json-server mock API.

```bash
# 1. install dependencies
npm install

# 2. start the mock API (terminal 1) — serves db.json on http://localhost:3001
npm run server

# 3. start the app (terminal 2) — http://localhost:5173
npm run dev
```

Then open http://localhost:5173.

> The Clients, Products, Orders pages and the Home dashboard all read/write `http://localhost:3001`. If json-server isn't running, those pages will show an error state.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run server` | Start json-server (mock REST API on port 3001) |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
  App.tsx                 # app shell + activePage routing + ToastProvider
  main.tsx                # entry
  theme.ts                # color tokens, spacing, chart colors
  types.ts                # shared TypeScript interfaces
  lib/api.ts              # tiny fetch wrapper (getAll/create/update/remove)
  components/
    Sidebar.tsx           # navigation (responsive drawer on mobile)
    MainContent.tsx       # renders the active page
    Home.tsx              # dashboard (stats + charts + recent orders)
    Clients.tsx           # Clients CRUD
    Products.tsx          # Products CRUD
    Orders.tsx            # Orders CRUD
    *Chart.tsx            # Recharts components
    ui/                   # reusable UI kit (Card, Button, Field, StatusPill, Toast, Skeleton, ...)
```

## API endpoints (json-server)

`clients`, `products`, `recentOrders`, `stats`, `revenue`, `weeklyOrders`, `salesByCategory`, `ordersVsCustomers` — all served from `db.json` at `http://localhost:3001`.

## 👤 Author

**Gehad Ahmed** — Front-End Developer

- 🔗 GitHub: [@gehad-ahmed](https://github.com/gehad-ahmed)
- 💼 LinkedIn: [Gehad Ahmed](https://www.linkedin.com/in/gehad-ahmed-9a8351259/)
- 📧 Email: gehadAhmedEzz.96@gmail.com

---

<p align="center">Made with 💜 by Gehad Ahmed — ⭐ Star this repo if you found it useful!</p>
