const inquirer = require("inquirer");
const cTable = require("console.table");
const colors = require("colors");
colors.setTheme({
  custom: ["bgCyan", "black"],
});

const Db = require("./db/database");
const { generateEmployeeChoices, generateChoices } = require("./utils/utils");
const {
  allEmployeesQuery,
  byDepartmentQuery,
  byManagerQuery,
  allRolesQuery,
  departmentSpendQuery,
} = require("./utils/queries");

const init = async () => {
  const db = new Db("workplace_db");

  await db.start("\n  WELCOME TO YOUR EMPLOYEE TRACKER.  \n".custom);

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
      const employeeData = await db.query(allEmployeesQuery());

      if (employeeData.length) {
        console.table(employeeData);
      } else {
        console.log("\n There are currently no employees to view. \n".custom);
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
          choices: generateChoices(allDepartments, "name"),
        };

        const { id } = await inquirer.prompt(whichDepartmentQuestion);

        const employeeByDepartment = await db.query(byDepartmentQuery(id));

        console.table(employeeByDepartment);
      } else {
        console.log("\n There are currently no employees to view. \n".custom);
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

        const { id } = await inquirer.prompt(whichManagerQuestion);

        const employeesByManager = await db.query(byManagerQuery(id));

        if (employeesByManager.length) {
          console.table(employeesByManager);
        } else {
          console.log("\nThis employee is not a manager.\n".custom);
        }
      } else {
        console.log("\nThere are currently no employees to view.\n".custom);
      }
    }

    if (option === "addEmployee") {
      const allRoles = await db.query(`SELECT * FROM role`);
      const allEmployees = await db.query(`SELECT * FROM employee`);
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (!allDepartments.length) {
        console.log(
          "\n Please add a department and some roles first. \n".custom
        );
      } else if (!allRoles.length) {
        console.log("\n Please add a job role first. \n".custom);
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
            choices: generateChoices(allRoles, "title"),
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

        const { id } = await inquirer.prompt(whichEmployee);

        db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, ["employee", "id", id]);
      } else {
        console.log("\n There are no employees to remove. \n".custom);
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
          choices: generateChoices(allRoles, "title"),
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
        console.log(
          "\n There are currently no employees in the database. \n".custom
        );
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

        const { id } = await inquirer.prompt(whichEmployee);

        const newEmployeeArray = allEmployees.filter(
          (employee) => employee.id !== id
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
          `${id}`,
        ]);
      } else {
        console.log("\nPlease add additional employees first.\n".custom);
      }
    }

    if (option === "allRoles") {
      const rolesAndDepartments = await db.params(allRolesQuery());

      if (rolesAndDepartments.length) {
        console.table(rolesAndDepartments);
      } else {
        console.log("\n There are currently no roles to view. \n".custom);
      }
    }

    if (option === "addRole") {
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (!allDepartments.length) {
        console.log("\n Please add a department first! \n".custom);
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
            choices: generateChoices(allDepartments, "name"),
          },
        ];

        const { title, salary, department_id } = await inquirer.prompt(
          addRoleQuestions
        );

        await db.queryParams(`INSERT INTO ?? SET ?`, [
          "role",
          { title, salary, department_id },
        ]);
      }
    }

    if (option === "removeRole") {
      const allRoles = await db.query(`SELECT * FROM role`);

      if (allRoles.length) {
        const whichRole = [
          {
            type: "list",
            message: "Which role would you like to remove?",
            name: "id",
            choices: generateChoices(allRoles, "title"),
          },
          {
            type: "confirm",
            message:
              "This action will also delete all employees with this role. Are you sure you want to continue?",
            name: "confirm",
          },
        ];

        const { id, confirm } = await inquirer.prompt(whichRole);

        if (confirm) {
          db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, ["role", "id", id]);
        }
      } else {
        console.log("\n There are currently no roles to remove. \n".custom);
      }
    }

    if (option === "allDepartments") {
      const allDepartments = await db.query(
        `SELECT name as "Department" FROM department`
      );

      if (allDepartments.length) {
        console.table(allDepartments);
      } else {
        console.log("\n There are currently no departments to view. \n".custom);
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

      const { name } = await inquirer.prompt(addDepartmentQuestion);

      await db.queryParams(`INSERT INTO ?? SET ?`, ["department", { name }]);
    }

    if (option === "removeDepartment") {
      const allDepartments = await db.query(`SELECT * FROM department`);

      if (allDepartments.length) {
        const whichDepartmentQuestions = [
          {
            type: "list",
            message: "Which department would you like to remove?",
            name: "id",
            choices: generateChoices(allDepartments, "name"),
          },
          {
            type: "confirm",
            message:
              "This action will also delete all role and employees linked to this department. Are you sure you want to continue?",
            name: "confirm",
          },
        ];

        const { id, confirm } = await inquirer.prompt(whichDepartmentQuestions);

        if (confirm) {
          db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
            "department",
            "id",
            id,
          ]);
        }
      } else {
        console.log(
          "\n There are currently no departments to remove. \n".custom
        );
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
          choices: generateChoices(allDepartments, "name"),
        };

        const { id } = await inquirer.prompt(whichDepartment);

        const totalSpend = await db.query(departmentSpendQuery(id));

        console.table(totalSpend);
      } else {
        console.log(
          "\n Please add some employees first. Currently the total spend is £0. \n"
            .custom
        );
      }
    }

    if (option === "EXIT") {
      inProgress = false;
      db.end("\n Thank you for using our app. \n".custom);
    }
  }
};

init();
