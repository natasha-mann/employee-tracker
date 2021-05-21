DROP DATABASE IF EXISTS workplace_db;
CREATE DATABASE workplace_db;

USE workplace_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);