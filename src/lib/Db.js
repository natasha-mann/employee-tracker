const mysql = require("mysql");

class Database {
  constructor(database) {
    const dbOptions = {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password",
      database,
    };

    this.database = database;
    this.connection = mysql.createConnection(dbOptions);
  }

  start(message) {
    return new Promise((resolve, reject) => {
      const onConnect = (err) => {
        if (err) reject(err);
        console.log(
          message ||
            `Connection to ${this.database} database was successful with id ${this.connection.threadId}`
        );
        resolve();
      };

      this.connection.connect(onConnect);
    });
  }

  end(message) {
    this.connection.end();
    console.log(
      message ||
        `Connection to ${this.database} database has been successfully closed.`
    );
  }

  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      const handleQuery = (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      };

      this.connection.query(sqlQuery, handleQuery);
    });
  }

  queryParams(sqlQuery, args, info = false) {
    return new Promise((resolve, reject) => {
      const handleQuery = (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      };

      const query = this.connection.query(sqlQuery, args, handleQuery);

      if (info) {
        console.log(query.sql);
      }
    });
  }
}

module.exports = Database;
