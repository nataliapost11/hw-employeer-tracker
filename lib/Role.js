const inquirer = require("inquirer");
require("console.table");

// The class responsible for retrieving and storing role details from the database
class Role {

  constructor(db) {
    this.db = db;
  }

  getAllRoles(onDone) {
    // Query database
    this.db.query('SELECT * FROM role', function (err, results) {
      console.log("\nList of roles");
      console.table(results);
      if (onDone) onDone();
    });
  }


  insertRole(roleData, onDone) {
    const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
    const params = [roleData.title, roleData.salary, roleData.deptId];

    this.db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added the role");
      }
      if (onDone) onDone();
    });
  }

  addNewRole(onDone) {
    inquirer
      .prompt([{
          type: 'input',
          name: 'title',
          message: 'What is the title of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for the role?',
        }, {
          type: 'input',
          name: 'deptId',
          message: 'What is the department id of the role?',
        }
      ])
      .then(val => {
        if (val) {
          this.insertRole(val, onDone);
        }
      });
  }
}


module.exports = Role;