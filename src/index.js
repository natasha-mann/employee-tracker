const inquirer = require("inquirer");
const cTable = require("console.table");

const Db = require("./db/database");

const init = async () => {
  const db = new Db("workplace_db");

  await db.start();

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
        name: "End App",
      },
    ],
  };

  const { option } = await inquirer.prompt(optionsQuestion);
  console.log(option);

  db.end("Thank you for using our app");
};

init();
