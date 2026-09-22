# Rafi Sheikh — Portfolio (MERN)

A production-ready personal portfolio: React + Tailwind CSS on the frontend,
Express + MongoDB on the backend for the contact form. Built to be edited —
every section is its own component, all content lives in plain data files,
and the theme is a handful of CSS variables.

## Structure

```
portfolio-mern/
├── client/                 React app (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     One file per section/UI piece
│   │   ├── context/        Theme (light/dark) provider
│   │   ├── hooks/          useReveal, useTypedText, useScrollProgress
│   │   ├── data/           projects.js, skills.js, timeline.js, links.js
│   │   ├── lib/            api.js — talks to the backend
│   │   └── index.css       Design tokens + Tailwind
│   └── vite.config.js
└── server/                 Express API (contact form → MongoDB)
    ├── models/Message.js
    ├── controllers/contact.controller.js
    ├── routes/contact.routes.js
    └── server.js
```

## Run it locally

You need Node.js 18+ and a MongoDB connection (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works fine — you don't need MongoDB installed on your machine).

**1. Backend**
```bash
cd server
cp .env.example .env      # then paste your MongoDB URI into .env
npm install
npm run dev                # starts on http://localhost:5000
```

**2. Frontend** (new terminal)
```bash
cd client
npm install
npm run dev                # starts on http://localhost:5173
```

Open http://localhost:5173. The contact form posts to the backend through
Vite's dev proxy (see `client/vite.config.js`), so both must be running.

If you don't want to set up MongoDB right now, the site still works —
only the contact form's "Send" button will show an error until the backend
is reachable.

## Admin dashboard

The site has two admin-only pages: **Messages** (`/admin`) and **Edit content**
(`/admin/content`). Log in once at `/admin/login` and both are unlocked.

**Set it up:** in `server/.env`, set `ADMIN_PASSWORD` (whatever you want to
log in with) and `JWT_SECRET` (any long random string — it signs your login
session, it isn't something you type in).

**Messages** — every contact-form submission lands here. Mark as read/unread,
delete, filter to unread only.

**Edit content** — this is the CMS half. Every piece of text on the site —
the hero name and tagline, the About paragraphs and stats, all three skill
groups and their percentage bars, every project card, the career timeline,
and the contact links — is stored in MongoDB and editable from tabs here.
Change something, click **Save changes**, refresh the live site — done. No
code, no redeploy, no touching `client/src/data/`.

There's also a **Sections** tab: add a free-form block (title + text +
an optional bullet list) and it appears on the homepage between Projects
and Contact automatically. This is the closest a database-driven page can
get to "add a new component" without a developer — it reuses one flexible
layout, so it's right for things like a "Services" or "Testimonials" block.
A genuinely new custom-designed piece of the page (its own animation, its
own layout) still means writing a new component the way this whole site
was built — see "Adding a new section or component" below.

This is intentionally simple: one password, one admin. If you ever need
multiple admin accounts, replace the check in
`server/controllers/auth.controller.js` with a real `User` model.

**Deploying with client-side routing:** because `/admin` and `/admin/content`
are React Router routes, not real folders on the server, your static host
needs to serve `index.html` for unknown paths. Netlify: add a
`client/public/_redirects` file containing `/*  /index.html  200`. Vercel:
add a `vercel.json` with a rewrite from `/(.*)` to `/index.html`. (Vite's
own dev server does this automatically, so you won't notice anything
missing until you deploy.)

## Editing content

Almost everything is edited from `/admin/content` now (see above) — you
shouldn't need to touch code for text changes. The exceptions:

| What you want to change      | File                                |
|-------------------------------|--------------------------------------|
| Nav menu labels/links          | `client/src/data/links.js`          |
| Colors, fonts                  | `client/src/index.css` (`:root`)    |
| "Open to work · Dhaka, BD" badge, section headings/blurbs | the relevant component in `client/src/components/` |

## Adding a new section or component

1. Create `client/src/components/YourSection.jsx` — copy the shape of an
   existing section (e.g. `About.jsx`) as a starting point.
2. Import it in `client/src/App.jsx` and drop `<YourSection />` where you
   want it to render.
3. If it needs a nav link, add it to `client/src/data/links.js` under `navLinks`.

Every section already uses the `useReveal` hook for scroll-in animation and
the shared `.panel` / `.rv` classes, so a new section matches the existing
look automatically.

## Production build & deploy

```bash
cd client && npm run build      # outputs client/dist — static, deploy anywhere
cd server && npm start          # run the API with a process manager (pm2, etc.)
```

Typical free-tier setup: deploy `client/dist` to Vercel/Netlify, deploy
`server/` to Render/Railway, put the server's URL into `client/.env` as
`VITE_API_URL`, and set `MONGO_URI` + `CLIENT_ORIGIN` on the server host.

## Environment variables

**server/.env**
```
PORT=5000
MONGO_URI=your-mongodb-connection-string
CLIENT_ORIGIN=http://localhost:5173
ADMIN_PASSWORD=your-dashboard-password
JWT_SECRET=a-long-random-string
# optional — only needed if you want email notifications on new messages
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
NOTIFY_EMAIL=
```

**client/.env** (only needed in production, dev uses the Vite proxy)
```
VITE_API_URL=https://your-api-domain.com
```
