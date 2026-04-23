CREATE DATABASE IF NOT EXISTS gofarm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'gofarm_user'@'localhost' IDENTIFIED BY 'ChangeThisPassword123!';

GRANT ALL PRIVILEGES ON gofarm.* TO 'gofarm_user'@'localhost';
FLUSH PRIVILEGES;

USE gofarm;

-- Tables are created automatically by the app on first run.
-- Start the app after setting .env.local to seed the database.

