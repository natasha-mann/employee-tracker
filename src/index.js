const inquirer = require("inquirer");
const cTable = require("console.table");

const Db = require("./db/database");
const {
  leftJoin,
  generateEmployeeChoices,
  generateRoleChoices,
  generateDepartmentChoices,
} = require("./utils/utils");

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
          value: "removeEmployee",
          name: "Remove an Employee",
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
          name: "Remove a Role",
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
          name: "Remove a Department",
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
        await db.query(`SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", name as "Department", title as "Role", salary as "Salary",  CONCAT (employee_manager.first_name, " ", employee_manager.last_name) as "Manager Name"
      FROM employee employee_role
      LEFT JOIN role ON employee_role.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id`);

      if (employeeData.length) {
        const table = cTable.getTable(employeeData);
        console.log(table);
      } else {
        console.log("There are currently no employees to view.");
      }
    }

    if (option === "viewAllByDepartment") {
      const allEmployees = await db.query(`SELECT * FROM employee`);

      const allDepartments = await db.query(`SELECT * FROM department`);

      if (allEmployees.length) {
        const whichDepartmentQuestion = {
          type: "list",
          message: "Which department's employees would you like to see?",
          name: "id",
          choices: generateDepartmentChoices(allDepartments),
        };

        const chosenDepartment = await inquirer.prompt(whichDepartmentQuestion);

        const employeeByDepartment = await db.query(`
        SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", name as "Department"
        FROM employee employee_role
        LEFT JOIN role ON employee_role.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE role.department_id = ${chosenDepartment.id};`);

        const table = cTable.getTable(employeeByDepartment);
        console.log(table);
      } else {
        console.log("There are currently no employees to view. ");
      }
    }

    if (option === "viewAllByManager") {
      const allEmployees = await db.query(`SELECT * FROM employee`);

      if (allEmployees.length) {
        const whichManagerQuestion = {
          type: "list",
          message: "Which manager's employees would you like to see?",
          name: "id",
          choices: generateEmployeeChoices(allEmployees),
        };

        const chosenManager = await inquirer.prompt(whichManagerQuestion);

        const employeesByManager =
          await db.query(`SELECT employee_role.first_name as "First Name", employee_role.last_name as "Last Name", title as "Role", CONCAT (employee_manager.first_name, " ", employee_manager.last_name) as "Manager Name"
        FROM employee employee_role
        LEFT JOIN role ON employee_role.role_id = role.id
        LEFT JOIN employee employee_manager ON employee_role.manager_id = employee_manager.id
        WHERE employee_role.manager_id = ${chosenManager.id}`);

        if (employeesByManager.length) {
          const table = cTable.getTable(employeesByManager);
          console.log(table);
        } else {
          console.log("This employee is not a manager.");
        }
      } else {
        console.log("There are currently no employees to view.");
      }
    }

    if (option === "addEmployee") {
      const allRoles = await db.query(`SELECT * FROM role`);
      const allEmployees = await db.query(`SELECT * FROM employee`);
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (!allRoles.length) {
        console.log("Please add a job role first!");
      } else if (!allDepartments.length) {
        console.log("Please add a department and some roles first!");
      } else {
        const addEmployeeQuestions = [
          {
            type: "input",
            message: "Enter the first name of the employee:",
            name: "first_name",
            validate: function (first_name) {
              return (
                /[^0-9]/.test(first_name) ||
                "Please enter the employee's first name."
              );
            },
          },
          {
            type: "input",
            message: "Enter the last name of the employee:",
            name: "last_name",
            validate: function (last_name) {
              return (
                /[^0-9]/.test(last_name) ||
                "Please enter the employee's last name."
              );
            },
          },
          {
            type: "list",
            message: "Select the employee's role:",
            name: "role_id",
            choices: generateRoleChoices(allRoles),
          },
        ];

        const { first_name, last_name, role_id } = await inquirer.prompt(
          addEmployeeQuestions
        );

        if (!allEmployees.length) {
          await db.queryParams(`INSERT INTO ?? SET ?`, [
            "employee",
            {
              first_name,
              last_name,
              role_id,
            },
          ]);
        } else {
          const setManagerQuestions = [
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
              choices: generateEmployeeChoices(allEmployees),
            },
          ];

          const { manager_id } = await inquirer.prompt(setManagerQuestions);

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
      }
    }

    if (option === "removeEmployee") {
      const allEmployees = await db.query(`SELECT * FROM employee`);

      if (allEmployees.length) {
        const whichEmployee = {
          type: "list",
          message: "Which role would you like to remove?",
          name: "id",
          choices: generateEmployeeChoices(allEmployees),
        };

        const chosenEmployee = await inquirer.prompt(whichEmployee);

        db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
          "employee",
          "id",
          chosenEmployee.id,
        ]);
      } else {
        console.log("There are no employees to remove.");
      }
    }

    if (option === "updateRole") {
      const allEmployees = await db.query(`SELECT * FROM employee`);
      const allRoles = await db.query(`SELECT * FROM role`);

      if (allEmployees.length) {
        const whichEmployee = {
          type: "list",
          message: "Which employee would you like to update?",
          name: "id",
          choices: generateEmployeeChoices(allEmployees),
        };

        const chosenEmployee = await inquirer.prompt(whichEmployee);

        const newRole = {
          type: "list",
          message: `What is the employee's new role?`,
          name: "id",
          choices: generateRoleChoices(allRoles),
        };

        const chosenRole = await inquirer.prompt(newRole);

        await db.queryParams(`UPDATE ?? SET ?? = ? WHERE ?? = ?`, [
          "employee",
          "role_id",
          `${chosenRole.id}`,
          "id",
          `${chosenEmployee.id}`,
        ]);
      } else {
        console.log("There are currently no employees.");
      }
    }

    if (option === "updateManager") {
      const allEmployees = await db.query(`SELECT * FROM employee`);

      if (allEmployees.length > 1) {
        const whichEmployee = {
          type: "list",
          message: "Which employee would you like to update?",
          name: "id",
          choices: generateEmployeeChoices(allEmployees),
        };

        const chosenEmployee = await inquirer.prompt(whichEmployee);

        const newEmployeeArray = allEmployees.filter(
          (employee) => employee.id !== chosenEmployee.id
        );

        const newManager = {
          type: "list",
          message: `Who is the employee's new manager?`,
          name: "id",
          choices: generateEmployeeChoices(newEmployeeArray),
        };

        const chosenManager = await inquirer.prompt(newManager);

        await db.queryParams(`UPDATE ?? SET ?? = ? WHERE ?? = ?`, [
          "employee",
          "manager_id",
          `${chosenManager.id}`,
          "id",
          `${chosenEmployee.id}`,
        ]);
      } else {
        console.log("Please add additional employees first.");
      }
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

      if (rolesAndDepartments.length) {
        const table = cTable.getTable(rolesAndDepartments);
        console.log(table);
      } else {
        console.log("There are currently no roles to view.");
      }
    }

    if (option === "addRole") {
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (!allDepartments.length) {
        console.log("Please add a department first!");
      } else {
        const addRoleQuestions = [
          {
            type: "input",
            message: "Enter the name of the role:",
            name: "title",
            validate: function (title) {
              return (
                /[^0-9]/.test(title) || "Please enter the employee's role."
              );
            },
          },
          {
            type: "input",
            message: "Enter the salary of the role:",
            name: "salary",
            validate: function (salary) {
              return /[0-9]/.test(salary) || "Please enter a number.";
            },
          },
          {
            type: "list",
            message: "Which department is this role in?:",
            name: "department_id",
            choices: generateDepartmentChoices(allDepartments),
          },
        ];

        const answers = await inquirer.prompt(addRoleQuestions);

        await db.queryParams(`INSERT INTO ?? SET ?`, ["role", answers]);
      }
    }

    if (option === "removeRole") {
      const allRoles = await db.query(`SELECT * FROM role`);

      if (allRoles.length) {
        const whichRole = {
          type: "list",
          message: "Which role would you like to remove?",
          name: "id",
          choices: generateRoleChoices(allRoles),
        };

        const chosenRole = await inquirer.prompt(whichRole);

        db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
          "role",
          "id",
          chosenRole.id,
        ]);
      } else {
        console.log("There are currently no roles to remove.");
      }
    }

    if (option === "allDepartments") {
      const allDepartments = await db.query(
        `SELECT name as "Department" FROM department`
      );

      if (allDepartments.length) {
        const table = cTable.getTable(allDepartments);
        console.log(table);
      } else {
        console.log("There are currently no departments to view.");
      }
    }

    if (option === "addDepartment") {
      const addDepartmentQuestion = [
        {
          type: "input",
          message: "Enter the name of the department:",
          name: "name",
          validate: function (salary) {
            return /[^0-9]/.test(salary) || "Please enter the department name.";
          },
        },
      ];

      const answers = await inquirer.prompt(addDepartmentQuestion);

      await db.queryParams(`INSERT INTO ?? SET ?`, ["department", answers]);
    }

    if (option === "removeDepartment") {
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (allDepartments.length) {
        const whichDepartment = {
          type: "list",
          message: "Which department would you like to remove?",
          name: "id",
          choices: generateDepartmentChoices(allDepartments),
        };

        const chosenDepartment = await inquirer.prompt(whichDepartment);

        db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
          "department",
          "id",
          chosenDepartment.id,
        ]);
      } else {
        console.log("There are currently no departments to remove.");
      }
    }

    if (option === "departmentSpend") {
      const allDepartments = await db.query(`SELECT * FROM department`);
      const allEmployees = await db.query(`SELECT * FROM employee`);

      if (allEmployees.length) {
        const whichDepartment = {
          type: "list",
          message: "Which department's budget spend would you like to view?",
          name: "id",
          choices: generateDepartmentChoices(allDepartments),
        };

        const chosenDepartment = await inquirer.prompt(whichDepartment);

        const totalSpend = await db.query(`
      SELECT name as "Department", SUM(salary) "Total Budget Spend", COUNT(employee.id) "Number of Employees"
        FROM employee
        LEFT JOIN role ON role.id = employee.role_id
        LEFT JOIN department ON role.department_id = department.id
        WHERE role.department_id = ${chosenDepartment.id};`);

        const table = cTable.getTable(totalSpend);
        console.log(table);
      } else {
        console.log(
          "Please add some employees first. Currently the total spend is £0"
        );
      }
    }

    if (option === "EXIT") {
      inProgress = false;
      db.end("Thank you for using our app");
    }
  }
};

init();
