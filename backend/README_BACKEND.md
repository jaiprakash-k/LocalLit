# Book Exchange Platform - Backend Deployment

This is the backend server for the Book Exchange Platform built with Express.js, MySQL, and Socket.io.

## Installation

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookexchange_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Socket.io Configuration
SOCKET_PORT=5001
```

## Database Setup

1. Create MySQL database:
```sql
mysql -u root -p < database/schema.sql
```

2. Or manually run the DDL in `database/schema.sql`

## Development

```bash
npm run dev
```

Runs on http://localhost:5000

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/me/profile` - Update profile
- `POST /api/users/me/upload-avatar` - Upload profile image
- `GET /api/users/me/stats` - Get user statistics

### Books
- `GET /api/books` - Get all books with filters
- `GET /api/books/:bookId` - Get book details
- `POST /api/books` - Create new book
- `PUT /api/books/:bookId` - Update book
- `DELETE /api/books/:bookId` - Delete book
- `GET /api/books/seller/:sellerId` - Get books by seller
- `GET /api/books/categories` - Get all categories

### Chat & Messages
- `POST /api/chats` - Create chat
- `GET /api/chats` - Get user chats
- `GET /api/chats/:chatId` - Get chat details
- `DELETE /api/chats/:chatId` - Delete chat
- `GET /api/messages/:chatId` - Get messages
- `PUT /api/messages/read` - Mark messages as read
- `DELETE /api/messages/:messageId` - Delete message

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId` - Update order status

### Exchanges
- `POST /api/exchanges` - Create exchange
- `GET /api/exchanges` - Get user exchanges
- `PUT /api/exchanges/:exchangeId/accept` - Accept exchange
- `PUT /api/exchanges/:exchangeId/reject` - Reject exchange

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:userId` - Get user reviews

## Technology Stack

- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time messaging
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## File Structure

```
backend/
├── config/              - Configuration files
├── models/              - Sequelize models
├── controllers/         - Business logic
├── routes/              - API routes
├── middleware/          - Custom middleware
├── utils/               - Utility functions
├── uploads/             - User uploaded files
├── database/            - SQL schemas
├── server.js            - Main entry point
├── package.json
└── .env                 - Environment variables
```
