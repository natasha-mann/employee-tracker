const { allEmployeesQuery } = require("../utils/queries");

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
}

module.exports = Workplace;
