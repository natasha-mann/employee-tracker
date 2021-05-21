USE workplace_db;


insert into department (name)
values ("Sales");
insert into department (name)
values ("Marketing");
insert into department (name)
values ("Engineering");
insert into department (name)
values ("Finance");

insert into role (title, salary, department_id)
values ("Salesperson", 24000, 1);
insert into role (title, salary, department_id)
values ("Sales Manager", 35000, 1);
insert into role (title, salary, department_id)
values ("Lead Engineer", 60000, 3);
insert into role (title, salary, department_id)
values ("Software Engineer", 35000, 3);
insert into role (title, salary, department_id)
values ("Marketing Intern", 20000, 2);
insert into role (title, salary, department_id)
values ("Marketing Manager", 29000, 2);
insert into role (title, salary, department_id)
values ("Accountant", 40000, 4);
insert into role (title, salary, department_id)
values ("Head of Finance", 75000, 4);

insert into employee (first_name, last_name, role_id)
values ("Sarah", "Clarke", 2);
insert into employee (first_name, last_name, role_id)
values ("Dave", "Robinson", 2);
insert into employee (first_name, last_name, role_id)
values ("Alice", "Brown", 3);
insert into employee (first_name, last_name, role_id, manager_id)
values ("Chis", "Jones", 4, 3);
insert into employee (first_name, last_name, role_id)
values ("Bob", "Smith", 7);