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

## Editing content (no code structure changes needed)

| What you want to change      | File                                |
|-------------------------------|--------------------------------------|
| Projects                      | `client/src/data/projects.js`       |
| Skills / proficiency bars      | `client/src/data/skills.js`         |
| Career timeline                | `client/src/data/timeline.js`       |
| Email / social links           | `client/src/data/links.js`          |
| Colors, fonts                  | `client/src/index.css` (`:root`)    |
| Hero name, tagline, roles      | `client/src/components/Hero.jsx`    |

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
