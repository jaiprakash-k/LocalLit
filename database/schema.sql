-- =======================
-- BOOK EXCHANGE PLATFORM DATABASE
-- =======================

CREATE DATABASE IF NOT EXISTS locallit;
USE locallit;

-- =======================
-- USERS TABLE
-- =======================
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- USER PROFILE TABLE
-- =======================
CREATE TABLE User_Profile (
  profile_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  bio TEXT,
  profile_image VARCHAR(255),
  rating_avg DECIMAL(3,2) DEFAULT 0.00,
  
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_rating (rating_avg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- USER LOCATION TABLE
-- =======================
CREATE TABLE User_Location (
  location_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_user_location (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- BOOK CATEGORY TABLE
-- =======================
CREATE TABLE Book_Category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  
  INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- BOOK TABLE
-- =======================
CREATE TABLE Book (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  listing_type ENUM('sell', 'lend', 'swap') DEFAULT 'sell',
  `condition` ENUM('new', 'like_new', 'good', 'fair', 'poor') NOT NULL,
  status ENUM('available', 'sold', 'exchanged', 'pending') DEFAULT 'available',
  city VARCHAR(100),
  state VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (seller_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES Book_Category(category_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_seller_id (seller_id),
  INDEX idx_category_id (category_id),
  INDEX idx_title (title),
  INDEX idx_status (status),
  INDEX idx_uploaded_at (uploaded_at),
  FULLTEXT INDEX ft_title_author (title, author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- BOOK IMAGES TABLE
-- =======================
CREATE TABLE Book_Images (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  
  FOREIGN KEY (book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_book_id (book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- CHAT TABLE
-- =======================
CREATE TABLE Chat (
  chat_id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_book_id (book_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  UNIQUE KEY unique_chat (book_id, sender_id, receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- MESSAGES TABLE
-- =======================
CREATE TABLE Messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  received_at TIMESTAMP NULL,
  
  FOREIGN KEY (chat_id) REFERENCES Chat(chat_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_chat_id (chat_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_sent_at (sent_at),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- ORDER TABLE
-- =======================
CREATE TABLE `Order` (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  book_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  
  FOREIGN KEY (buyer_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_book_id (book_id),
  INDEX idx_order_status (order_status),
  INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- EXCHANGE TABLE
-- =======================
CREATE TABLE Exchange (
  exchange_id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  requester_id INT NOT NULL,
  exchange_status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  exchange_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_owner_id (owner_id),
  INDEX idx_requester_id (requester_id),
  INDEX idx_exchange_status (exchange_status),
  INDEX idx_exchange_date (exchange_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- EXCHANGE BOOKS TABLE
-- =======================
CREATE TABLE Exchange_Books (
  exchange_book_id INT PRIMARY KEY AUTO_INCREMENT,
  exchange_id INT NOT NULL,
  offered_book_id INT NOT NULL,
  requested_book_id INT NOT NULL,
  
  FOREIGN KEY (exchange_id) REFERENCES Exchange(exchange_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (offered_book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (requested_book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_exchange_id (exchange_id),
  INDEX idx_offered_book_id (offered_book_id),
  INDEX idx_requested_book_id (requested_book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- REVIEW TABLE
-- =======================
CREATE TABLE Review (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  reviewer_id INT NOT NULL,
  reviewed_user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reviewer_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_reviewed_user_id (reviewed_user_id),
  INDEX idx_review_date (review_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================
-- SAMPLE DATA INSERTION
-- =======================

INSERT INTO Book_Category (category_name) VALUES 
('Fiction'),
('Non-Fiction'),
('Science & Technology'),
('Biography'),
('History'),
('Mystery & Thriller'),
('Romance'),
('Self-Help'),
('Education'),
('Art & Design');

COMMIT;
