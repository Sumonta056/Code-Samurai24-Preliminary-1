DROP DATABASE patientsdb;

CREATE DATABASE patientsdb;

USE patientsdb;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT PRIMARY KEY,
  user_name VARCHAR(255),
  balance INT
);

DROP TABLE IF EXISTS stations;

CREATE TABLE stations (
  station_id INT PRIMARY KEY,
  station_name VARCHAR(255),
  longitude FLOAT,
  latitude FLOAT
);

DROP TABLE IF EXISTS trains;

CREATE TABLE trains (
  train_id INT PRIMARY KEY,
  train_name VARCHAR(255),
  capacity INT
);

DROP TABLE IF EXISTS train_stops;

CREATE TABLE train_stops (
  train_id INT,
  station_id INT,
  arrival_time VARCHAR(100),
  departure_time VARCHAR(100),
  fare INT,
  FOREIGN KEY (train_id) REFERENCES trains(train_id),
  FOREIGN KEY (station_id) REFERENCES stations(station_id)
);

DROP TABLE IF EXISTS wallets;

CREATE TABLE wallets (
  wallet_id INT PRIMARY KEY,
  balance INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL
);

DROP TABLE IF EXISTS coords;

CREATE TABLE coords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  x INT NOT NULL,
  y INT NOT NULL
);

DROP TABLE IF EXISTS patients;

CREATE TABLE patients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) DEFAULT NULL,
  last_name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(255) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  diagnosis VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT UQ_Patients_Email UNIQUE (email)
);

DELIMITER / / CREATE PROCEDURE create_and_return(
  IN first_name VARCHAR(255),
  IN last_name VARCHAR(255),
  IN email VARCHAR(255),
  IN phone VARCHAR(255),
  IN address VARCHAR(255),
  IN diagnosis VARCHAR(255),
  IN image_url VARCHAR(255)
) BEGIN
INSERT INTO
  patients(
    first_name,
    last_name,
    email,
    phone,
    address,
    diagnosis,
    image_url
  )
VALUES
  (
    first_name,
    last_name,
    email,
    phone,
    address,
    diagnosis,
    image_url
  );

SET
  @PATIENT_ID = LAST_INSERT_ID();

SELECT
  *
FROM
  patients
WHERE
  id = @PATIENT_ID;

END / / DELIMITER;