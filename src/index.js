const inquirer = require("inquirer");
const cTable = require("console.table");
const colors = require("colors");

const Db = require("./lib/Db");

const Workplace = require("./lib/Workplace");

colors.setTheme({
  custom: ["bgCyan", "black"],
  success: ["bgGreen", "black"],
  removed: ["bgRed", "white"],
});

const init = async () => {
  const db = new Db("workplace_db");

  await db.start("\n\n  WELCOME TO YOUR EMPLOYEE TRACKER.  \n\n".custom);

  const workplace = new Workplace(db);

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
      await workplace.viewAllEmployees();
    }

    if (option === "viewAllByDepartment") {
      await workplace.viewAllByDepartment();
    }

    if (option === "viewAllByManager") {
      await workplace.viewAllByManager();
    }

    if (option === "addEmployee") {
      await workplace.addEmployee();
    }

    if (option === "removeEmployee") {
      await workplace.removeEmployee();
    }

    if (option === "updateRole") {
      await workplace.updateRole();
    }

    if (option === "updateManager") {
      await workplace.updateManager();
    }

    if (option === "allRoles") {
      await workplace.allRoles();
    }

    if (option === "addRole") {
      await workplace.addRole();
    }

    if (option === "removeRole") {
      await workplace.removeRole();
    }

    if (option === "allDepartments") {
      await workplace.allDepartments();
    }

    if (option === "addDepartment") {
      await workplace.addDepartment();
    }

    if (option === "removeDepartment") {
      await workplace.removeDepartment();
    }

    if (option === "departmentSpend") {
      await workplace.departmentSpend();
    }

    if (option === "EXIT") {
      inProgress = false;
      db.end("\n\n  Thank you for using our app.  \n\n".custom);
    }
  }
};

init();
