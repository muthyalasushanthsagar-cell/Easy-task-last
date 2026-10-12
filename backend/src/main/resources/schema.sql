-- ===================================================================
-- Easy Task - MySQL Schema Definition
-- Run this in MySQL Workbench or mysql CLI if creating manually
-- ===================================================================

CREATE DATABASE IF NOT EXISTS easy_task_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE easy_task_db;

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'General',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    start_date_time DATETIME,
    due_date_time DATETIME,
    reminder_date_time DATETIME,
    reminder_advance_minutes INT,
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    completed_at DATETIME
);

-- Grocery Lists Table
CREATE TABLE IF NOT EXISTS grocery_lists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    color VARCHAR(50) DEFAULT '#4f46e5',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Grocery List Items Table
CREATE TABLE IF NOT EXISTS grocery_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grocery_list_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100),
    category VARCHAR(100) DEFAULT 'General',
    purchased BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (grocery_list_id) REFERENCES grocery_lists(id) ON DELETE CASCADE
);

-- In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'REMINDER',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL
);
