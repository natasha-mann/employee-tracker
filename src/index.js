const inquirer = require("inquirer");
const cTable = require("console.table");

const Db = require("./db/database");

const init = async () => {
  const db = new Db("workplace_db");

  await db.start();
  db.end("Thank you for using our app");
};

init();
