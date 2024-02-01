DROP DATABASE patientsdb;

CREATE DATABASE patientsdb;

USE patientsdb;

DROP TABLE IF EXISTS coords;

CREATE TABLE coords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  x INT NOT NULL,
  y INT NOT NULL
);


