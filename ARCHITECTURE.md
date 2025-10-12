# 🏗️ Perseverance Architecture Diagram

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐      │
│  │              React Application                      │      │
│  │              (Port 5173)                            │      │
│  ├────────────────────────────────────────────────────┤      │
│  │                                                     │      │
│  │  Pages:                    Components:             │      │
│  │  • Dashboard               • HabitCard             │      │
│  │  • Habits                  • WeekCalendar          │      │
│  │  • Statistics              • ProgressRing          │      │
│  │  • Calendar                • QuickStats            │      │
│  │  • Login ⭐                • SmartInsights         │      │
│  │  • Register ⭐             • ErrorBoundary         │      │
│  │  • Settings                • Modals...             │      │
│  │  • Journal                                         │      │
│  │  • FocusMode                                       │      │
│  │                                                     │      │
│  ├────────────────────────────────────────────────────┤      │
│  │                                                     │      │
│  │  Context:                  Services:               │      │
│  │  • HabitContext ⭐         • API Service ⭐         │      │
│  │    - Auth functions        • Backup Service        │      │
│  │    - CRUD operations       • Data Service          │      │
│  │    - Syncs with API                                │      │
│  │    - Falls back to                                 │      │
│  │      localStorage                                  │      │
│  │                                                     │      │
│  └────────────────────────────────────────────────────┘      │
│                          ▲                                    │
│                          │ REST API                           │
│                          │ (axios)                            │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │ Authorization: Bearer <token>
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                    │
│  ┌────────────────────────────────────────────────────┐      │
│  │           Express.js Server                        │      │
│  │           (Node.js - Port 5000)                    │      │
│  ├────────────────────────────────────────────────────┤      │
│  │                                                     │      │
│  │  Middleware:                                       │      │
│  │  • CORS (allow frontend origin)                   │      │
│  │  • Body Parser (JSON)                              │      │
│  │  • Auth Middleware ⭐ (JWT verification)           │      │
│  │  • Error Handler                                   │      │
│  │                                                     │      │
│  ├────────────────────────────────────────────────────┤      │
│  │                                                     │      │
│  │  Routes:                                           │      │
│  │                                                     │      │
│  │  /api/auth/*                                       │      │
│  │  ├── POST /register (create user)                 │      │
│  │  ├── POST /login (authenticate)                   │      │
│  │  ├── GET  /me (get current user) 🔒               │      │
│  │  └── PUT  /settings (update settings) 🔒          │      │
│  │                                                     │      │
│  │  /api/habits/*                                     │      │
│  │  ├── GET    / (list habits) 🔒                     │      │
│  │  ├── POST   / (create habit) 🔒                    │      │
│  │  ├── GET    /:id (get habit) 🔒                    │      │
│  │  ├── PUT    /:id (update habit) 🔒                 │      │
│  │  └── DELETE /:id (delete habit) 🔒                 │      │
│  │                                                     │      │
│  │  /api/completions/*                                │      │
│  │  ├── GET    / (list completions) 🔒                │      │
│  │  ├── POST   / (mark complete) 🔒                   │      │
│  │  ├── PUT    /:id (update) 🔒                       │      │
│  │  ├── DELETE /:id (delete) 🔒                       │      │
│  │  └── GET    /stats/:habitId 🔒                     │      │
│  │                                                     │      │
│  └────────────────────────────────────────────────────┘      │
│                          ▲                                    │
│                          │ Mongoose ODM                       │
│                          │                                    │
│                        SERVER                                 │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                    │
│  ┌────────────────────────────────────────────────────┐      │
│  │              MongoDB Database                       │      │
│  │              (Port 27017)                           │      │
│  ├────────────────────────────────────────────────────┤      │
│  │                                                     │      │
│  │  Collections:                                      │      │
│  │                                                     │      │
│  │  ┌──────────────┐  ┌──────────────┐               │      │
│  │  │   users      │  │   habits     │               │      │
│  │  ├──────────────┤  ├──────────────┤               │      │
│  │  │ _id          │  │ _id          │               │      │
│  │  │ email (uniq) │  │ userId (ref) │               │      │
│  │  │ password     │  │ name         │               │      │
│  │  │ name         │  │ description  │               │      │
│  │  │ settings     │  │ category     │               │      │
│  │  │ createdAt    │  │ color        │               │      │
│  │  │ updatedAt    │  │ frequency    │               │      │
│  │  └──────────────┘  │ target       │               │      │
│  │                    │ icon         │               │      │
│  │                    │ isActive     │               │      │
│  │                    │ createdDate  │               │      │
│  │                    │ createdAt    │               │      │
│  │                    │ updatedAt    │               │      │
│  │                    └──────────────┘               │      │
│  │                                                     │      │
│  │  ┌──────────────────┐                              │      │
│  │  │  completions     │                              │      │
│  │  ├──────────────────┤                              │      │
│  │  │ _id              │                              │      │
│  │  │ userId (ref)     │                              │      │
│  │  │ habitId (ref)    │                              │      │
│  │  │ date             │                              │      │
│  │  │ completed        │                              │      │
│  │  │ note             │                              │      │
│  │  │ timestamp        │                              │      │
│  │  │ createdAt        │                              │      │
│  │  │ updatedAt        │                              │      │
│  │  └──────────────────┘                              │      │
│  │                                                     │      │
│  │  Indexes:                                          │      │
│  │  • users: email (unique)                           │      │
│  │  • habits: userId, isActive                        │      │
│  │  • completions: userId+habitId+date                │      │
│  │                                                     │      │
│  └────────────────────────────────────────────────────┘      │
│                                                               │
│                       DATABASE                                │
└───────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                         ┌──────────┐
│  Client  │                                         │  Server  │
└────┬─────┘                                         └────┬─────┘
     │                                                    │
     │  1. POST /api/auth/register                       │
     │     { email, password, name }                     │
     ├──────────────────────────────────────────────────►│
     │                                                    │
     │                                    2. Hash password│
     │                                    3. Save to DB  │
     │                                    4. Generate JWT│
     │                                                    │
     │  5. Return { user, token }                        │
     │◄──────────────────────────────────────────────────┤
     │                                                    │
     │  6. Store token in localStorage                   │
     │                                                    │
     │  7. GET /api/habits                               │
     │     Headers: Authorization: Bearer <token>        │
     ├──────────────────────────────────────────────────►│
     │                                                    │
     │                                    8. Verify token │
     │                                    9. Decode userId│
     │                                    10. Query DB    │
     │                                                    │
     │  11. Return habits                                │
     │◄──────────────────────────────────────────────────┤
     │                                                    │
```

## Data Sync Strategy

```
┌─────────────────────────────────────────────────────┐
│              Dual Storage Strategy                  │
└─────────────────────────────────────────────────────┘

Guest Mode:
├── All data → localStorage only
├── No authentication required
├── Works completely offline
└── Data limited to single device

Authenticated Mode:
├── Primary → MongoDB (cloud)
├── Backup → localStorage (cached copy)
├── On successful API call → Update both
├── On API failure → Use cached data
└── On login → Sync from MongoDB

Benefits:
├── Offline functionality
├── Fast initial load (from cache)
├── Data persistence across devices
└── Seamless user experience
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│                 Security Stack                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: Frontend                                 │
│  └── Token storage in localStorage                │
│  └── Automatic token attachment to requests       │
│  └── Redirect on 401 Unauthorized                 │
│                                                     │
│  Layer 2: Network                                  │
│  └── CORS configuration                            │
│  └── HTTPS in production                           │
│                                                     │
│  Layer 3: Backend                                  │
│  └── JWT verification middleware                   │
│  └── Protected route handlers                      │
│  └── Input validation                              │
│                                                     │
│  Layer 4: Database                                 │
│  └── Password hashing (bcrypt)                     │
│  └── User isolation (userId filter)                │
│  └── Indexed queries                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Legend

⭐ = New/Modified for MongoDB integration
🔒 = Protected route (requires authentication)
(ref) = Reference to another collection

```

```
