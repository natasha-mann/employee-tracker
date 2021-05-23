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

-- show all employees with roles, salarys, department name and manager

SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", salary as "Salary", name as "Department", employee_manager.first_name as "Manager First Name", employee_manager.last_name as "Manager Last Name"
FROM employee employee_role
LEFT JOIN role ON employee_role.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;
LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id

-- show all employees with roles, salarys, department name

SELECT first_name as "First Name", last_name as "Last Name", title as "Role", salary as "Salary", name as "Department", manager_id as "Manager"
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;

-- show all departments with corresponding roles

SELECT name, title, salary
FROM department 
LEFT JOIN role ON role.department_id = department.id

-- get all roles with department information
SELECT title as "Role", salary as "Salary", name as "Department"
FROM department 
RIGHT JOIN role ON role.department_id = department.id