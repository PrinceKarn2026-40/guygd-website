-- GUYGD PostgreSQL Schema

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth DATE,
  address TEXT,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin', 'executive', 'super_admin')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scholarships (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE SET NULL,
  applicant_name VARCHAR(100) NOT NULL,
  school VARCHAR(150),
  level VARCHAR(30) CHECK (level IN ('High School', 'Undergraduate', 'Postgraduate', 'Vocational')),
  essay TEXT,
  supporting_docs VARCHAR(255),
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(200),
  event_date TIMESTAMP,
  image_url VARCHAR(255),
  category VARCHAR(30) CHECK (category IN ('Education', 'Health', 'Governance', 'Culture', 'General')),
  created_by INT REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  summary TEXT,
  image_url VARCHAR(255),
  category VARCHAR(50),
  author_id INT REFERENCES members(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(100),
  email VARCHAR(100),
  amount DECIMAL(10,2),
  purpose VARCHAR(200),
  transaction_ref VARCHAR(100),
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150),
  image_url VARCHAR(255),
  caption TEXT,
  category VARCHAR(50),
  event_id INT REFERENCES events(id) ON DELETE SET NULL,
  uploaded_by INT REFERENCES members(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
