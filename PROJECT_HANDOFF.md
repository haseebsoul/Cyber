# CyberSentinel-AI — Project Handoff

Last updated: 2026-10-22

## Purpose

This file helps a future ChatGPT session continue the project from the
current state. Read this document and inspect the actual source files
before changing code. Do not assume a file is implemented just because
it exists.

## Developer preferences

- Teach in simple English, step by step.
- Give exact PowerShell commands.
- Explain which file connects to which module.
- Keep the existing frontend appearance unchanged unless explicitly asked.
- Prefer a clean, modular backend.
- Inspect before deleting; do not remove unverified project files.
- Do not expose credentials or commit `.env`.

## Project location and GitHub

- Local project: `Z:\Cyber-main`
- Intended GitHub remote: `https://github.com/haseebsoul/Cyber`
- Frontend folder: `frontend`
- Backend folder: `backend`

## Work completed in the recent terminal session

1. Inspected the backend package configuration and installed dependencies.
2. Created the backend folders `models` and `routes`.
3. Created these files if they were missing:
   - `backend/controllers/authController.js`
   - `backend/models/User.js`
   - `backend/routes/authRoutes.js`
   - `backend/connection.js`
   - `backend/.env`
   - `backend/.gitignore`
4. Added Mongoose connection logic to `backend/connection.js`.
   It reads `process.env.MONGO_URI`, connects using `mongoose.connect`,
   logs connection errors, and exports `connectDB` using CommonJS.
5. Confirmed backend dependencies were installed:
   - Express
   - Mongoose
   - CORS
   - dotenv
   - nodemon
6. Confirmed `backend/.gitignore` contains:
   - `.env`
   - `node_modules/`

## Backend architecture target

```text
backend/
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── connection.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Intended registration request flow

React registration form
  -> Axios POST request
  -> backend/server.js
  -> routes/authRoutes.js
  -> controllers/authController.js
  -> models/User.js
  -> MongoDB Atlas

`connection.js` provides the MongoDB connection.
`package.json` currently uses CommonJS (`"type": "commonjs"`).

## Current limitations — important

At the last confirmed inspection:
- `backend/server.js` was empty.
- `backend/controllers/authController.js` was empty.
- `backend/models/User.js` was empty.
- `backend/routes/authRoutes.js` was empty.
- `backend/connection.js` was subsequently populated with connection logic.
- `backend/package.json` had Express, Mongoose, CORS and dotenv dependencies
  and nodemon as a development dependency.
- The backend did not yet have a working registration API.
- The frontend registration form was previously observed saving session
  information locally and navigating to `/admin`; it had not yet been
  connected to the backend in this workflow.

Do not claim registration, login, JWT authentication, or MongoDB persistence
works until these are implemented and tested.

## MongoDB Atlas and environment configuration

The intended environment variable names are:

- `MONGO_URI`
- `PORT`
- `JWT_SECRET`

The intended server port is `5000`.

The last reported verification showed:
- `PORT` configured as `5000`.
- `MONGO_URI` check returned false.
- `JWT_SECRET` check returned false.

The developer was instructed to enter the real Atlas URI locally and
generate a new private JWT secret. Completion was not confirmed afterward.
Recheck the configuration without printing its values.

Never put actual credentials in this document, source control, terminal
logs, screenshots, or chat messages. Keep `.env` ignored by Git. If a
credential has been exposed, rotate it.

## Next implementation steps

1. Safely verify the local `.env` variables without printing secrets.
2. Complete and test `connection.js` with MongoDB Atlas.
3. Implement `models/User.js` with appropriate validation and password
   hashing. Never store plaintext passwords.
4. Implement registration logic in `controllers/authController.js`.
5. Define the registration endpoint in `routes/authRoutes.js`.
6. Implement `server.js` with dotenv, Express JSON middleware, CORS,
   database connection, and `/api/auth` route mounting.
7. Connect the existing registration form to the API without changing
   its design.
8. Test validation, duplicate registrations, error handling, and database
   persistence.
9. Review security, dependencies, and production configuration.

## Instructions for the next ChatGPT session

Read this file first, inspect Git status and the actual files, and compare
the current code against this handoff. Treat the handoff as a progress
record, not proof that implementation or tests succeeded. Continue with
one practical step at a time. Do not overwrite existing work or expose
secrets.
