const queries = {
  allEmployeesQuery:
    () => `SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", name as "Department", title as "Role", salary as "Salary",  CONCAT (employee_manager.first_name, " ", employee_manager.last_name) as "Manager Name"
  FROM employee employee_role
  LEFT JOIN role ON employee_role.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id`,

  byDepartmentQuery: (id) => `
  SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", name as "Department"
  FROM employee employee_role
  LEFT JOIN role ON employee_role.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  WHERE role.department_id = ${id};`,

  byManagerQuery: (
    id
  ) => `SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", CONCAT (employee_manager.first_name, " ", employee_manager.last_name) as "Manager Name"
  FROM employee employee_role
  LEFT JOIN role ON employee_role.role_id = role.id
  LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id
  WHERE employee_role.manager_id = ${id}`,

  allRolesQuery: () => `
  SELECT title as "Role", salary as "Salary", name as "Department"
  FROM role 
  LEFT JOIN department ON role.department_id = department.id
  `,

  departmentSpendQuery: (id) => `
  SELECT name as "Department", SUM(salary) "Total Budget Spend", COUNT(employee.id) "Number of Employees"
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON role.department_id = department.id
    WHERE role.department_id = ${id};`,
};

module.exports = queries;
