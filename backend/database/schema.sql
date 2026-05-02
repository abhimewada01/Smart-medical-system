-- Smart Medical System Database Schema
-- MySQL Database Creation Script

-- Create Database
CREATE DATABASE IF NOT EXISTS medical_system;
USE medical_system;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  clinic_name VARCHAR(255),
  role ENUM('Administrator', 'Doctor', 'Nurse', 'User') DEFAULT 'User',
  avatar VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_active (is_active),
  INDEX idx_role (role)
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires (expires_at),
  INDEX idx_user_id (user_id)
);

-- Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 10,
  price_usd DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_inr DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  expiry_date DATE NOT NULL,
  supplier VARCHAR(255),
  status ENUM('Good', 'Critical') DEFAULT 'Good',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_category (category),
  INDEX idx_supplier (supplier),
  INDEX idx_status (status),
  INDEX idx_stock (stock),
  INDEX idx_expiry (expiry_date),
  INDEX idx_created (created_at)
);

-- Insert Sample Data
INSERT INTO users (name, email, password_hash, phone, address, clinic_name, role) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@medicareclinic.com', '$2a$10$...', '+91 9876543210', '123 Medical Center, Delhi, India 110001', 'MediCare Central Clinic', 'Administrator'),
('Dr. Rajesh Kumar', 'rajesh.kumar@medicareclinic.com', '$2a$10$...', '+91 8765432109', '456 Hospital Road, Mumbai, India 400001', 'City Health Clinic', 'Doctor'),
('Dr. Priya Sharma', 'priya.sharma@medicareclinic.com', '$2a$10$...', '+91 7654321098', '789 Nursing Home, Bangalore, India 560001', 'Care Medical Center', 'Nurse');

-- Insert Sample Medicines
INSERT INTO medicines (name, category, stock, min_stock, price_usd, price_inr, expiry_date, supplier) VALUES
('Paracetamol 500mg', 'Pain Relief', 45, 100, 2.50, 207.50, '2026-12-31', 'PharmaCorp'),
('Amoxicillin 250mg', 'Antibiotic', 20, 50, 5.00, 415.00, '2026-10-15', 'MediSupply'),
('Ibuprofen 400mg', 'Pain Relief', 30, 80, 3.50, 290.50, '2027-03-20', 'PharmaCorp'),
('Vitamin D3 1000IU', 'Vitamins', 150, 60, 8.00, 664.00, '2027-06-30', 'HealthPlus'),
('Omeprazole 20mg', 'Gastric', 85, 70, 4.50, 373.50, '2026-09-10', 'MediSupply'),
('Aspirin 75mg', 'Cardiovascular', 120, 90, 1.50, 124.50, '2027-01-15', 'PharmaCorp'),
('Metformin 500mg', 'Diabetes', 15, 60, 6.00, 498.00, '2026-11-20', 'DiabetesCare'),
('Cetirizine 10mg', 'Allergy', 95, 70, 2.00, 166.00, '2027-04-25', 'HealthPlus');

-- Update some medicines to have low stock for testing
UPDATE medicines SET stock = 5 WHERE id IN (1, 2, 7);
UPDATE medicines SET stock = 8 WHERE id = 3;
UPDATE medicines SET stock = 15 WHERE id = 4;
