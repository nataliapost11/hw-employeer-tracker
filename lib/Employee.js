const inquirer = require("inquirer");
require("console.table");

// The class responsible for retrieving and storing employee details from the database
class Employee {

  constructor(db) {
    this.db = db;
  }

  getAllEmployees(onDone) {
    // Query database
    this.db.query('SELECT * FROM employee', function (err, results) {
      console.log("\nList of all employees");
      console.table(results);
      if (onDone) onDone();
    });
  }

  inserEmployee(empData, onDone) {
    const sql = `INSERT INTO emplyee (name) VALUES (?)`;
    const params = [deptName];

    this.db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added the employee");
      }
      if (onDone) onDone();
    });
  }

  addNewEmployee() {
    inquirer
      .prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the employee?',
      }])
      .then(val => {
        if (val.name) {
          this.inserEmployee(val.name, onDone);
        }
      });
  }

  updateEmployeeRole(onDone) {
    console.log("Update empployee role");
    if (onDone) onDone();
  }
}


module.exports = Employee;