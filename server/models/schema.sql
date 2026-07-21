CREATE DATABASE IF NOT EXISTS guygd_db;
USE guygd_db;

CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  gender ENUM('Male', 'Female', 'Other'),
  date_of_birth DATE,
  address TEXT,
  role ENUM('member', 'admin', 'executive') DEFAULT 'member',
  status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scholarships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT,
  applicant_name VARCHAR(100) NOT NULL,
  school VARCHAR(150),
  level ENUM('High School', 'Undergraduate', 'Postgraduate', 'Vocational'),
  essay TEXT,
  supporting_docs VARCHAR(255),
  status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(200),
  event_date DATETIME,
  category ENUM('Education', 'Health', 'Governance', 'Culture', 'General'),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  image_url VARCHAR(255),
  author_id INT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_name VARCHAR(100),
  email VARCHAR(100),
  amount DECIMAL(10,2),
  purpose VARCHAR(200),
  transaction_ref VARCHAR(100),
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  image_url VARCHAR(255),
  event_id INT NULL,
  uploaded_by INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES members(id) ON DELETE SET NULL
);
