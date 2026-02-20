# Kodbank

Kodbank is a hyper-premium, futuristic banking web application. It features a stunning "Titanium Noir" aesthetic, robust JWT-based authentication with email verification, and simulated banking capabilities including real-time atomic transfers, virtual card management, and transaction logging.

## Features

- **Hyper-Premium UI (Titanium Noir):** Ultra-heavy glassmorphism, pure blacks mixed with metallic grays, and glowing electric accents (Cyan/Magenta). Supports stunning CSS-based 3D interactive holographic cards (`react-parallax-tilt`) and cinematic floating animations.
- **Secure Authentication:** 
  - JWT-based authentication with stateful token management.
  - Email Verification Flow via Nodemailer (mocked using Ethereal test accounts).
  - Encrypted, secure passwords and protected Express routes.
- **Banking Capabilities:**
  - **Dashboard:** Cinematic visualization of "Liquid Assets" and limits.
  - **Transfers:** Simulated edge-to-edge secure terminal modal for sending funds to other users with atomic transaction rollbacks.
  - **Ledger Record:** High-tech incoming/outgoing transaction history viewing.
  - **Card Nodes:** View dynamically generated virtual cards representing authorized entities.

## Technical Architecture

- **Frontend:** React (Vite), Vanilla CSS, React Router DOM, Axios, React-Parallax-Tilt, Canvas-Confetti.
- **Backend:** Node.js, Express, Sequelize ORM, JSON Web Tokens (JWT), Nodemailer, Crypto.
- **Database:** SQLite (Requires zero setup, runs instantly on clone).

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Git.

### 1. Clone the Repository
```bash
git clone https://github.com/jaydeepsingh2003/kodbank.git
cd kodbank
```

### 2. Install Dependencies
This project is split into a `client` (frontend) and `server` (backend).

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd ../client
npm install
```

### 3. Environment Variables (Server)
A predefined `.env` is typically used, but the defaults should work directly with SQLite out of the box in development. If needed, create an `e:/kodbank/server/.env` based on standard Express configs (like `PORT=5000` and `JWT_SECRET=yoursecret`).

### 4. Running the Application
A convenient `start.bat` script is included in the root to run both servers simultaneously if you are on Windows:
```bash
cd kodbank
start.bat
```
*Alternatively, you can manually run `npm run dev` inside `/client` and `npm start` inside `/server`.*

## Testing the Application / Email Verification Flow
1. Navigate to the registration page (`http://localhost:5173/register`).
2. Fill out the "Elite Onboarding" form to request access.
3. Check the **backend Node server terminal console** for a dispatched email link from Ethereal (e.g., `https://ethereal.email/message/...`). Open it to view the fake email or pull the `verify/token` link out of it.
4. Click the verification link to authorize your identity.
5. Log in through the secure frontend portal and enjoy the Titanium Noir banking experience!

## Contributing
All UI changes should adhere to the "Titanium Noir" aesthetic guidelines located in the core client CSS map.

---
*Built as a concept showcase of premium frontend web development colliding with robust backend transaction architectures.*
