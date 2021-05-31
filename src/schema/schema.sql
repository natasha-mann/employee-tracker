DROP DATABASE IF EXISTS workplace_db;
CREATE DATABASE workplace_db;

USE workplace_db;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8,2),
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_department
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
   CONSTRAINT fk_role
    FOREIGN KEY (role_id) 
    REFERENCES role(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
   CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

