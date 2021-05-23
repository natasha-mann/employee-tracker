const inquirer = require("inquirer");
const cTable = require("console.table");

const Db = require("./db/database");
const { leftJoin } = require("./utils/utils");

const init = async () => {
  const db = new Db("workplace_db");

  await db.start();

  let inProgress = true;

  while (inProgress) {
    const optionsQuestion = {
      type: "list",
      message: "What would you like to do?",
      name: "option",
      choices: [
        {
          short: "All Employees",
          value: "viewAllEmployees",
          name: "View All Employees",
        },
        {
          short: "Employees By Department",
          value: "viewAllByDepartment",
          name: "View All Employees By Department",
        },
        {
          short: "Employees By Manager",
          value: "viewAllByManager",
          name: "View All Employees By Manager",
        },
        {
          value: "addEmployee",
          name: "Add Employee",
        },
        {
          value: "deleteEmployee",
          name: "Delete Employee",
        },
        {
          short: "Employee Role",
          value: "updateRole",
          name: "Update Employee Role",
        },
        {
          short: "Employee Manager",
          value: "updateManager",
          name: "Update Employee Manager",
        },
        {
          short: "All Roles",
          value: "allRoles",
          name: "View All Roles",
        },
        {
          value: "addRole",
          name: "Add Role",
        },
        {
          value: "removeRole",
          name: "Remove Role",
        },
        {
          short: "All Departments",
          value: "allDepartments",
          name: "View All Departments",
        },
        {
          value: "addDepartment",
          name: "Add Department",
        },
        {
          value: "removeDepartment",
          name: "Remove Department",
        },
        {
          short: "Department Spend",
          value: "departmentSpend",
          name: "View Total Utilised Budget of a Department",
        },
        {
          short: "Exit",
          value: "EXIT",
          name: "EXIT APP",
        },
      ],
    };

    const { option } = await inquirer.prompt(optionsQuestion);

    if (option === "viewAllEmployees") {
      const employeeData =
        await db.query(`SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", salary as "Salary", name as "Department", employee_manager.first_name as "Manager First Name", employee_manager.last_name as "Manager Last Name"
      FROM employee employee_role
      LEFT JOIN role ON employee_role.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id`);

      const table = cTable.getTable(employeeData);
      console.log(table);
    }

    if (option === "addEmployee") {
      const allRoles = await db.query(selectAll("role"));
      const allEmployees = await db.query(selectAll("employee"));

      const generateRoleChoices = (roles) => {
        return roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });
      };

      const generateManagerChoices = (employees) => {
        return employees.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          };
        });
      };

      const addEmployeeQuestions = [
        {
          type: "input",
          message: "Enter the first name of the employee:",
          name: "first_name",
        },
        {
          type: "input",
          message: "Enter the last name of the employee:",
          name: "last_name",
        },
        {
          type: "list",
          message: "Select the employee's role:",
          name: "role_id",
          choices: generateRoleChoices(allRoles),
        },
        {
          type: "confirm",
          message: "Does the employee have a manager?",
          name: "hasManager",
        },
        {
          type: "list",
          message: "Select the employee's manager:",
          name: "manager_id",
          when: (answers) => {
            return answers.hasManager;
          },
          choices: generateManagerChoices(allEmployees),
        },
      ];

      const { first_name, last_name, role_id, manager_id } =
        await inquirer.prompt(addEmployeeQuestions);

      await db.queryParams(`INSERT INTO ?? SET ?`, [
        "employee",
        {
          first_name,
          last_name,
          role_id,
          manager_id,
        },
      ]);
    }

    if (option === "allRoles") {
      const rolesAndDepartments = await db.queryParams(leftJoin(), [
        "title",
        "Role",
        "salary",
        "Salary",
        "name",
        "Department",
        "role",
        "department",
        "role.department_id",
        "department.id",
      ]);

      const table = cTable.getTable(rolesAndDepartments);
      console.log(table);
    }

    if (option === "addRole") {
      const allDepartments = await db.query(selectAll("department"));

      const generateChoices = (departments) => {
        return departments.map((department) => {
          return {
            name: department.name,
            value: department.id,
          };
        });
      };

      const addRoleQuestions = [
        {
          type: "input",
          message: "Enter the name of the role:",
          name: "title",
        },
        {
          type: "number",
          message: "Enter the salary of the role:",
          name: "salary",
        },
        {
          type: "list",
          message: "Which department is this role in?:",
          name: "department_id",
          choices: generateChoices(allDepartments),
        },
      ];

      const answers = await inquirer.prompt(addRoleQuestions);

      await db.queryParams(`INSERT INTO ?? SET ?`, ["role", answers]);
    }

    if (option === "allDepartments") {
      const allDepartments = await db.query(
        `SELECT name as "Department" FROM department`
      );

      const table = cTable.getTable(allDepartments);
      console.log(table);
    }

    if (option === "addDepartment") {
      const addDepartmentQuestion = [
        {
          type: "input",
          message: "Enter the name of the department:",
          name: "name",
        },
      ];

      const answers = await inquirer.prompt(addDepartmentQuestion);

      await db.queryParams(`INSERT INTO ?? SET ?`, ["department", answers]);
    }

    if (option === "EXIT") {
      inProgress = false;
      db.end("Thank you for using our app");
    }
  }
};

init();
