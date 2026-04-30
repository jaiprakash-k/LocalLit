# LocalLit - Book Exchange Platform

LocalLit is a full-stack web application designed for users to buy, sell, and exchange books locally. It features real-time messaging, comprehensive book listings, order management, and an intuitive, modern user interface.

## 🌟 Features

- **User Authentication**: Secure signup and login using JWT.
- **Book Marketplace**: Browse, search, filter, and view detailed listings of books available for sale or exchange.
- **Real-Time Chat**: Integrated chat system using Socket.io to allow buyers and sellers to communicate instantly.
- **Book Exchanges & Orders**: Users can propose direct book exchanges or purchase books outright.
- **User Profiles**: Manage your listings, view statistics, and upload an avatar.
- **Responsive UI**: A fully responsive frontend built with React and Tailwind CSS.

## 🛠 Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **Vite** - Next-generation frontend tooling and build system
- **React Router** - For client-side routing
- **Axios** - For making HTTP requests
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Lucide Icons** - Modern icon pack

### Backend
- **Node.js & Express.js** - Fast, unopinionated web framework
- **MySQL** - Relational database for robust data storage
- **Sequelize** - Promise-based Node.js ORM for MySQL
- **Socket.io** - Real-time bidirectional event-based communication
- **JSON Web Tokens (JWT)** - Secure authentication
- **Multer** - Handling `multipart/form-data` for file uploads
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MySQL](https://www.mysql.com/) installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/jaiprakash-k/LocalLit.git
cd LocalLit
```

### 2. Database Setup
1. Create a local MySQL database named `bookexchange_db` (or whatever you prefer).
2. Import the schema provided in the `database` folder:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Backend Setup
1. Navigate to the `backend` directory:
```bash
cd backend
```
2. Install the dependencies:
```bash
npm install
```
3. Create a `.env` file in the `backend` directory and add your configurations:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bookexchange_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Socket.io Configuration
SOCKET_PORT=5001
```
4. Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```
2. Install the dependencies:
```bash
npm install
```
3. (Optional) Create a `.env` file if frontend-specific configurations are needed (e.g., changing the API URL).
4. Start the frontend development server:
```bash
npm run dev
```
5. The application should now be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
LocalLit/
├── backend/               # Express server and API
│   ├── config/            # Database, JWT, and multer configurations
│   ├── controllers/       # Route logic and handlers
│   ├── middleware/        # Authentication, upload, and error middleware
│   ├── models/            # Sequelize database models
│   ├── routes/            # API endpoints definition
│   ├── utils/             # Helper utilities and Socket setup
│   └── server.js          # Backend entry point
│
├── frontend/              # React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components (Auth, Books, Chat, Layout, etc.)
│   │   ├── context/       # React Context providers (Auth, Theme, Chat)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Top-level page components
│   │   ├── services/      # API communication layers
│   │   ├── styles/        # Global and Theme CSS
│   │   └── App.jsx        # Root component and Router setup
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js     # Vite configuration
│
└── database/              # SQL schema dump files
```

---

## 📡 API Reference

Here is a brief overview of the main API routes available. All backend endpoints are prefixed with `/api`.

- **Auth**: `/auth/register`, `/auth/login`, `/auth/logout`
- **Users**: `/users/me`, `/users/:userId`, `/users/me/profile`, `/users/me/upload-avatar`
- **Books**: `/books`, `/books/:bookId`, `/books/categories`, `/books/seller/:sellerId`
- **Chat**: `/chats`, `/chats/:chatId`, `/messages/:chatId`
- **Orders**: `/orders`, `/orders/:orderId`
- **Exchanges**: `/exchanges`, `/exchanges/:exchangeId/accept`
- **Reviews**: `/reviews`

For detailed parameters and payloads, please refer to the backend source code located in `backend/routes/` and `backend/controllers/`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/jaiprakash-k/LocalLit/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
