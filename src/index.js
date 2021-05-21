const inquirer = require("inquirer");
const cTable = require("console.table");

const Db = require("./db/database");

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

    if (option === "allDepartments") {
      const allDepartments = await db.selectAll("department");
      const departmentNames = allDepartments.map((each) => {
        return {
          department: each.name,
        };
      });

      const table = cTable.getTable(departmentNames);
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

      await db.insert("department", answers);
    }

    if (option === "EXIT") {
      inProgress = false;
      db.end("Thank you for using our app");
    }
  }
};

init();
