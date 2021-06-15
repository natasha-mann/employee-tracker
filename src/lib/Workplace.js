const inquirer = require("inquirer");

const { generateEmployeeChoices, generateChoices } = require("../utils/utils");
const {
  allEmployeesQuery,
  byDepartmentQuery,
  byManagerQuery,
  allRolesQuery,
  departmentSpendQuery,
} = require("../utils/queries");

class Workplace {
  constructor(db) {
    this.db = db;
  }

  async viewAllEmployees() {
    const employeeData = await this.db.query(allEmployeesQuery());

    if (employeeData.length) {
      console.table(employeeData);
    } else {
      console.log("\n There are currently no employees to view. \n".custom);
    }
  }

  async viewAllByDepartment() {
    const allEmployees = await this.db.query(`SELECT * FROM employee`);

    const allDepartments = await this.db.query(`SELECT * FROM department`);

    if (allEmployees.length) {
      const whichDepartmentQuestion = {
        type: "list",
        message: "Which department's employees would you like to see?",
        name: "id",
        choices: generateChoices(allDepartments, "name"),
      };

      const { id } = await inquirer.prompt(whichDepartmentQuestion);

      const employeeByDepartment = await this.db.query(byDepartmentQuery(id));

      console.table(employeeByDepartment);
    } else {
      console.log("\n There are currently no employees to view. \n".custom);
    }
  }

  async viewAllByManager() {
    const allEmployees = await this.db.query(`SELECT * FROM employee`);

    if (allEmployees.length) {
      const whichManagerQuestion = {
        type: "list",
        message: "Which manager's employees would you like to see?",
        name: "id",
        choices: generateEmployeeChoices(allEmployees),
      };

      const { id } = await inquirer.prompt(whichManagerQuestion);

      const employeesByManager = await this.db.query(byManagerQuery(id));

      if (employeesByManager.length) {
        console.table(employeesByManager);
      } else {
        console.log("\nThis employee is not a manager.\n".custom);
      }
    } else {
      console.log("\nThere are currently no employees to view.\n".custom);
    }
  }

  async addEmployee() {
    const allRoles = await this.db.query(`SELECT * FROM role`);
    const allEmployees = await this.db.query(`SELECT * FROM employee`);
    const allDepartments = await this.db.query(`SELECT * FROM department`);

    if (!allDepartments.length) {
      console.log("\n Please add a department and some roles first. \n".custom);
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
        await this.db.queryParams(`INSERT INTO ?? SET ?`, [
          "employee",
          {
            first_name,
            last_name,
            role_id,
          },
        ]);
        console.log(
          `\n New employee successfully added: ${first_name} ${last_name}. \n`
            .success
        );
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

        await this.db.queryParams(`INSERT INTO ?? SET ?`, [
          "employee",
          {
            first_name,
            last_name,
            role_id,
            manager_id,
          },
        ]);
        console.log(
          `\n New employee successfully added: ${first_name} ${last_name}. \n`
            .success
        );
      }
    }
  }

  async removeEmployee() {
    const allEmployees = await this.db.query(`SELECT * FROM employee`);

    if (allEmployees.length) {
      const whichEmployee = {
        type: "list",
        message: "Which employee would you like to remove?",
        name: "id",
        choices: generateEmployeeChoices(allEmployees),
      };

      const { id } = await inquirer.prompt(whichEmployee);

      this.db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
        "employee",
        "id",
        id,
      ]);
      console.log(`\n Successfully removed employee. \n`.removed);
    } else {
      console.log("\n There are no employees to remove. \n".custom);
    }
  }

  async updateRole() {
    const allEmployees = await this.db.query(`SELECT * FROM employee`);
    const allRoles = await this.db.query(`SELECT * FROM role`);

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

      await this.db.queryParams(`UPDATE ?? SET ?? = ? WHERE ?? = ?`, [
        "employee",
        "role_id",
        `${chosenRole.id}`,
        "id",
        `${chosenEmployee.id}`,
      ]);
      console.log(`\n Role successfully updated. \n`.success);
    } else {
      console.log(
        "\n There are currently no employees in the database. \n".custom
      );
    }
  }

  async updateManager() {
    const allEmployees = await this.db.query(`SELECT * FROM employee`);

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

      await this.db.queryParams(`UPDATE ?? SET ?? = ? WHERE ?? = ?`, [
        "employee",
        "manager_id",
        `${chosenManager.id}`,
        "id",
        `${id}`,
      ]);
      console.log(`\n Manager successfully updated. \n`.success);
    } else {
      console.log("\nPlease add additional employees first.\n".custom);
    }
  }

  async allRoles() {
    const rolesAndDepartments = await this.db.queryParams(allRolesQuery());

    if (rolesAndDepartments.length) {
      console.table(rolesAndDepartments);
    } else {
      console.log("\n There are currently no roles to view. \n".custom);
    }
  }

  async addRole() {
    const allDepartments = await this.db.query(`SELECT * FROM department`);

    if (!allDepartments.length) {
      console.log("\n Please add a department first! \n".custom);
    } else {
      const addRoleQuestions = [
        {
          type: "input",
          message: "Enter the name of the role:",
          name: "title",
          validate: function (title) {
            return /[^0-9]/.test(title) || "Please enter the employee's role.";
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

      await this.db.queryParams(`INSERT INTO ?? SET ?`, [
        "role",
        { title, salary, department_id },
      ]);
      console.log(`\n New role successfully added: ${title}. \n`.success);
    }
  }

  async removeRole() {
    const allRoles = await this.db.query(`SELECT * FROM role`);

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
        this.db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, ["role", "id", id]);
        console.log(`\n Role successfully removed. \n`.removed);
      }
    } else {
      console.log("\n There are currently no roles to remove. \n".custom);
    }
  }

  async allDepartments() {
    const allDepartments = await this.db.query(
      `SELECT name as "Department" FROM department`
    );

    if (allDepartments.length) {
      console.table(allDepartments);
    } else {
      console.log("\n There are currently no departments to view. \n".custom);
    }
  }

  async addDepartment() {
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

    await this.db.queryParams(`INSERT INTO ?? SET ?`, ["department", { name }]);
    console.log(`\n New department successfully added: ${name} \n`.success);
  }

  async removeDepartment() {
    const allDepartments = await this.db.query(`SELECT * FROM department`);

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
        this.db.queryParams(`DELETE FROM ?? WHERE ?? = ?`, [
          "department",
          "id",
          id,
        ]);
        console.log(`\n Department successfully removed. \n`.removed);
      }
    } else {
      console.log("\n There are currently no departments to remove. \n".custom);
    }
  }

  async departmentSpend() {
    const allDepartments = await this.db.query(`SELECT * FROM department`);
    const allEmployees = await this.db.query(`SELECT * FROM employee`);

    if (allEmployees.length) {
      const whichDepartment = {
        type: "list",
        message: "Which department's budget spend would you like to view?",
        name: "id",
        choices: generateChoices(allDepartments, "name"),
      };

      const { id } = await inquirer.prompt(whichDepartment);

      const totalSpend = await this.db.query(departmentSpendQuery(id));

      console.table(totalSpend);
    } else {
      console.log(
        "\n Please add some employees first. Currently the total spend is £0. \n"
          .custom
      );
    }
  }
}

module.exports = Workplace;
