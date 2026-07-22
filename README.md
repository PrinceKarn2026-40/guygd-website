# GUYGD — Official Website
> Gbeh-lay United Youths for Growth and Development

![GUYGD Flag](client/public/assets/images/hero-banner.jpg)

---

## About
Official web platform for **GUYGD** — connecting youth, promoting education,
civic responsibility, and sustainable community development in Gbeh-lay, Liberia.

> **Motto:** Voice of the Voiceless
> **Established:** May 14, 2023

---

## Live Site
🌐 [https://guygd-website-production.up.railway.app](https://guygd-website-production.up.railway.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Railway) |
| Auth | JWT (JSON Web Tokens) |
| Version Control | GitHub |
| Hosting | Railway |
| Email | Nodemailer |

---

## Project Structure

```
guygd-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── client/
│   ├── public/
│   │   └── assets/
│   │       ├── images/
│   │       │   └── hero-banner.jpg
│   │       └── docs/
│   └── src/
│       ├── pages/
│       │   ├── index.html
│       │   ├── about.html
│       │   ├── programs.html
│       │   ├── membership.html
│       │   ├── scholarships.html
│       │   ├── news.html
│       │   ├── events.html
│       │   ├── gallery.html
│       │   ├── contact.html
│       │   ├── donate.html
│       │   └── dashboard/
│       │       ├── admin.html
│       │       └── member.html
│       ├── css/
│       │   ├── main.css
│       │   ├── dashboard.css
│       │   └── responsive.css
│       └── js/
│           └── main.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── scholarshipController.js
│   │   ├── eventController.js
│   │   ├── newsController.js
│   │   ├── donationController.js
│   │   ├── contactController.js
│   │   └── galleryController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── scholarships.js
│   │   ├── events.js
│   │   ├── news.js
│   │   ├── donations.js
│   │   ├── contact.js
│   │   └── gallery.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   └── schema.sql
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── Procfile
├── railway.json
└── README.md
```

---

## Database Schema

| Table | Description |
|---|---|
| members | All users (members, admins, executives, super_admin) |
| scholarships | Scholarship applications |
| events | Upcoming and past events |
| news | News articles and announcements |
| donations | Donation records |
| contact_messages | Contact form submissions |
| gallery | Photo gallery images |

---

## Website Pages

### Public Pages
| Page | URL |
|---|---|
| Home | `/index.html` |
| About | `/about.html` |
| Programs | `/programs.html` |
| Scholarships | `/scholarships.html` |
| News | `/news.html` |
| Events | `/events.html` |
| Gallery | `/gallery.html` |
| Donate | `/donate.html` |
| Contact | `/contact.html` |
| Register / Login | `/membership.html` |

### Protected Pages
| Page | URL | Access |
|---|---|---|
| Member Dashboard | `/dashboard/member.html` | Members |
| Admin Dashboard | `/dashboard/admin.html` | Admin / Executive / Super Admin |

---

## Admin Dashboard Sections

- 📊 Dashboard — Stats overview
- 🎓 Applications — Scholarship review
- 👥 Members — Approve / suspend members
- 📅 Events — Create and manage events
- 📰 News — Publish articles
- 🖼️ Gallery — Upload photos
- 💰 Donations — View donation records
- ✉️ Messages — Contact form inbox
- 🔔 Notifications — Pending actions
- 📈 Reports — Summary statistics
- 👤 Users — Role management
- ⚙️ Settings — Change password

---

## API Endpoints

```
AUTH
POST   /api/auth/register
POST   /api/auth/login

MEMBERS
GET    /api/members
GET    /api/members/:id
PUT    /api/members/:id
PATCH  /api/members/:id/status

SCHOLARSHIPS
POST   /api/scholarships
GET    /api/scholarships
GET    /api/scholarships/:id
PUT    /api/scholarships/:id

EVENTS
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id

NEWS
GET    /api/news
POST   /api/news
PUT    /api/news/:id
DELETE /api/news/:id

DONATIONS
POST   /api/donations
GET    /api/donations

CONTACT
POST   /api/contact
GET    /api/contact

GALLERY
GET    /api/gallery
POST   /api/gallery
DELETE /api/gallery/:id
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Git

### Installation

```bash
git clone https://github.com/PrinceKarn2026-40/guygd-website.git
cd guygd-website
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Database Setup
Run the schema on your PostgreSQL database:
```bash
psql -U postgres -d guygd_db < server/models/schema.sql
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
NODE_ENV=production
CLIENT_URL=https://your-domain.up.railway.app
```

---

## Branch Strategy

```
main          → Production (auto-deploys to Railway)
develop       → Staging / testing
feature/*     → Individual features
hotfix/*      → Urgent bug fixes
```

---

## Deployment

This project auto-deploys to **Railway** on every push to `main`.

```bash
git add .
git commit -m "your message"
git push origin main
# Railway auto-deploys ✅
```

---

## Admin Account

| Field | Value |
|---|---|
| Email | admin@guygd.org |
| Role | super_admin |

> ⚠️ Change the default password after first login via Settings.

---

## Core Objectives

1. **Education & Capacity Building** — Scholarships, mentorship, digital literacy
2. **Social Responsibility & Public Health** — Zero tolerance for substance abuse
3. **Good Governance & Civic Engagement** — Voter education, accountability
4. **Leadership, Ethics & Culture** — Integrity, tolerance, entrepreneurship
5. **Organizational Strength** — Transparent finances, clear governance
6. **Partnerships & Community Impact** — NGOs, local businesses, government

---

## License
MIT License — GUYGD 2025

---

*Built with ❤️ for the youth of Gbeh-lay*
