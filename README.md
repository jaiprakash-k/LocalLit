<div align="center">

<img src="https://img.shields.io/badge/LocalLit-Book%20Exchange%20Platform-4f46e5?style=for-the-badge&logo=bookstack&logoColor=white" alt="LocalLit Banner"/>

# 📚 LocalLit

### *Connect Readers. Exchange Stories. Build Community.*

A full-stack web platform for discovering, buying, selling, and exchanging books with people in your local community — powered by real-time messaging and a clean, modern interface.

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)

<br/>

[Features](#-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

LocalLit is built to make local book trading effortless, safe, and enjoyable. Here's what it offers out of the box:

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT-based registration and login with bcrypt password hashing |
| 📖 **Book Marketplace** | Browse, search, and filter comprehensive book listings for sale or exchange |
| 💬 **Real-Time Chat** | Instant buyer-seller communication powered by Socket.io |
| 🔄 **Book Exchanges** | Propose and accept direct book-for-book trade offers |
| 🛒 **Order Management** | Full purchase flow with order creation and status tracking |
| 👤 **User Profiles** | Personal dashboards with listing management, stats, and avatar uploads |
| 📱 **Responsive Design** | Fully adaptive UI for desktop, tablet, and mobile using Tailwind CSS |
| 🗂️ **Category Browsing** | Filter books by genre, condition, price range, and more |
| ⭐ **Reviews & Ratings** | Community-driven trust through seller reviews |

---

## 🛠 Technology Stack

LocalLit uses a modern, production-proven stack for both reliability and developer experience.

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://reactjs.org/) | 18 | Component-based UI rendering |
| [Vite](https://vitejs.dev/) | Latest | Lightning-fast build tooling and HMR |
| [React Router](https://reactrouter.com/) | v6 | Client-side navigation and routing |
| [Axios](https://axios-http.com/) | Latest | Promise-based HTTP client |
| [Tailwind CSS](https://tailwindcss.com/) | v3 | Utility-first responsive styling |
| [Socket.io Client](https://socket.io/) | Latest | Real-time event-based communication |
| [Lucide Icons](https://lucide.dev/) | Latest | Clean, consistent icon system |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | v16+ | JavaScript runtime environment |
| [Express.js](https://expressjs.com/) | v4 | Minimal and flexible web framework |
| [MySQL](https://www.mysql.com/) | 8.0 | Relational database for persistent storage |
| [Sequelize](https://sequelize.org/) | v6 | Promise-based ORM for MySQL |
| [Socket.io](https://socket.io/) | Latest | Bidirectional real-time communication |
| [JSON Web Tokens](https://jwt.io/) | Latest | Stateless authentication |
| [Multer](https://github.com/expressjs/multer) | Latest | Multipart file upload handling |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Latest | Secure password hashing |

---

## 🚀 Getting Started

Follow these steps to set up LocalLit on your local machine for development.

### Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/)** — v16.0.0 or higher (`node -v` to check)
- **[npm](https://www.npmjs.com/)** — v8 or higher (bundled with Node.js)
- **[MySQL](https://www.mysql.com/)** — v8.0 or higher, running locally
- **[Git](https://git-scm.com/)** — for cloning the repository

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/jaiprakash-k/LocalLit.git
cd LocalLit
```

---

### Step 2 — Database Setup

1. Log into your MySQL instance:
   ```bash
   mysql -u root -p
   ```

2. Create the application database:
   ```sql
   CREATE DATABASE bookexchange_db;
   EXIT;
   ```

3. Import the schema:
   ```bash
   mysql -u root -p bookexchange_db < database/schema.sql
   ```

> 💡 **Tip:** You can rename the database to anything you prefer — just make sure to update the `DB_NAME` value in your `.env` file accordingly.

---

### Step 3 — Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```bash
   cp .env.example .env   # if an example file exists, otherwise create manually
   ```

4. Populate the `.env` file with your local configuration:

   ```env
   # ─── Database ────────────────────────────────────────────────
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=bookexchange_db
   DB_PORT=3306

   # ─── Server ──────────────────────────────────────────────────
   PORT=5000
   NODE_ENV=development

   # ─── Authentication ──────────────────────────────────────────
   JWT_SECRET=your_strong_jwt_secret_key_here
   JWT_EXPIRATION=7d

   # ─── File Uploads ────────────────────────────────────────────
   MAX_FILE_SIZE=5242880   # 5 MB in bytes
   UPLOAD_DIR=./uploads

   # ─── CORS ────────────────────────────────────────────────────
   CORS_ORIGIN=http://localhost:5173

   # ─── Socket.io ───────────────────────────────────────────────
   SOCKET_PORT=5001
   ```

   > ⚠️ **Security Note:** Never commit your `.env` file to version control. Add it to `.gitignore` if not already present.

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API server will be available at `http://localhost:5000`.

---

### Step 4 — Frontend Setup

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create a `.env` file to override default API settings:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5001
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### ✅ Verify Your Setup

Once both servers are running, you should be able to:

- [ ] Visit `http://localhost:5173` and see the LocalLit homepage
- [ ] Register a new user account
- [ ] Log in and access your dashboard
- [ ] Browse the book marketplace
- [ ] Create a book listing

---

## 📁 Project Structure

```
LocalLit/
│
├── backend/                        # Node.js + Express REST API
│   ├── config/
│   │   ├── database.js             # Sequelize connection configuration
│   │   ├── jwt.js                  # JWT signing and verification config
│   │   └── multer.js               # File upload configuration
│   │
│   ├── controllers/                # Business logic and request handlers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── chatController.js
│   │   ├── exchangeController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   ├── upload.js               # Multer file upload middleware
│   │   └── errorHandler.js         # Centralized error handling
│   │
│   ├── models/                     # Sequelize ORM models
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Order.js
│   │   ├── Exchange.js
│   │   └── Review.js
│   │
│   ├── routes/                     # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── exchangeRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   └── socket.js               # Socket.io event setup and handlers
│   │
│   ├── uploads/                    # Uploaded files (avatars, book covers)
│   └── server.js                   # Application entry point
│
├── frontend/                       # React + Vite single-page application
│   ├── public/                     # Static assets
│   └── src/
│       ├── components/             # Reusable UI components
│       │   ├── Auth/               # Login, Register forms
│       │   ├── Books/              # BookCard, BookList, BookForm
│       │   ├── Chat/               # ChatWindow, MessageBubble
│       │   └── Layout/             # Navbar, Footer, Sidebar
│       │
│       ├── context/                # Global React state providers
│       │   ├── AuthContext.jsx     # Authentication state
│       │   ├── ThemeContext.jsx    # Light/dark theme state
│       │   └── ChatContext.jsx     # Active chat and message state
│       │
│       ├── hooks/                  # Custom React hooks
│       ├── pages/                  # Route-level page components
│       ├── services/               # Axios API service modules
│       ├── styles/                 # Global CSS and theme variables
│       └── App.jsx                 # Root component and router setup
│
│   ├── tailwind.config.js          # Tailwind CSS customization
│   └── vite.config.js              # Vite build configuration
│
└── database/
    └── schema.sql                  # Full MySQL schema dump
```

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT token |
| `POST` | `/api/auth/logout` | Protected | Invalidate current session |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/users/me` | Protected | Get the authenticated user's profile |
| `GET` | `/api/users/:userId` | Public | Get a public user profile by ID |
| `PUT` | `/api/users/me/profile` | Protected | Update profile details |
| `POST` | `/api/users/me/upload-avatar` | Protected | Upload a profile avatar image |

### Books

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/books` | Public | List all books (supports filters & search) |
| `POST` | `/api/books` | Protected | Create a new book listing |
| `GET` | `/api/books/:bookId` | Public | Get details of a specific book |
| `PUT` | `/api/books/:bookId` | Protected | Update a book listing (owner only) |
| `DELETE` | `/api/books/:bookId` | Protected | Delete a book listing (owner only) |
| `GET` | `/api/books/categories` | Public | Retrieve all available book categories |
| `GET` | `/api/books/seller/:sellerId` | Public | Get all listings by a specific seller |

### Chat & Messaging

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/chats` | Protected | Get all chats for the current user |
| `POST` | `/api/chats` | Protected | Initiate a new chat with a seller |
| `GET` | `/api/chats/:chatId` | Protected | Get a specific chat thread |
| `GET` | `/api/messages/:chatId` | Protected | Get all messages in a chat |

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/orders` | Protected | Get all orders for the current user |
| `POST` | `/api/orders` | Protected | Place a new order |
| `GET` | `/api/orders/:orderId` | Protected | Get details of a specific order |

### Exchanges

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/exchanges` | Protected | Get all exchange proposals for the user |
| `POST` | `/api/exchanges` | Protected | Propose a new book exchange |
| `PUT` | `/api/exchanges/:exchangeId/accept` | Protected | Accept an incoming exchange offer |

### Reviews

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/reviews` | Protected | Submit a review for a completed transaction |

> 📝 For full request/response payloads and query parameter details, refer to the source files in `backend/routes/` and `backend/controllers/`.

---

## 🔌 Real-Time Events (Socket.io)

LocalLit uses Socket.io for live chat. Below are the key events:

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_chat` | Client → Server | Join a specific chat room |
| `send_message` | Client → Server | Send a new message |
| `receive_message` | Server → Client | Receive a new message in real-time |
| `user_typing` | Client → Server | Broadcast typing indicator |
| `typing_status` | Server → Client | Notify other users of typing activity |

---

## 🧪 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot-reload via Nodemon |
| `npm start` | Start the production server |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the source files |

---

## 🤝 Contributing

Contributions are warmly welcomed! Whether it's a bug fix, new feature, or documentation improvement — every contribution helps.

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat: add book recommendation engine"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch

Please check the [open issues](https://github.com/jaiprakash-k/LocalLit/issues) before starting work on something new — someone might already be on it!

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|--------|-------|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only changes |
| `style:` | Formatting, missing semicolons, etc. |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `chore:` | Build process or auxiliary tool changes |

---

## 🐛 Known Issues & Roadmap

- [ ] Push notifications for new messages
- [ ] Google / OAuth social login
- [ ] Advanced search with Elasticsearch
- [ ] Book condition photo uploads (multi-image support)
- [ ] In-app payment integration
- [ ] Email verification on signup

---

## 📝 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute this software. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

Made with ❤️ by [jaiprakash-k](https://github.com/jaiprakash-k)

⭐ **Star this repo if you find it useful!**

</div>
