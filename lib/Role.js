const inquirer = require("inquirer");
require("console.table");

// The class responsible for retrieving and storing role details from the database
class Role {

  constructor(db) {
    this.db = db;
  }

  getAllRoles(onDone) {     
    const sql = `SELECT r.title Title, r.id ID, d.name Department, r.salary Salary
                FROM role r INNER JOIN department d
                ON r.department_id = d.id`;

    this.db.query(sql, function (err, results) {
      console.log("\nList of all roles");
      if(results.length) console.table(results);
      else console.log("No roles available");
      if(err) console.log(err);
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
        console.log("Successfully added the role\n");
      }
      if (onDone) onDone();
    });
  }

  getAllDepatmentNames(onDone) {     
    const sql = `SELECT d.id, d.name FROM department d`;
    this.db.query(sql, function (err, results) { 
      if(err) console.log(err); 
      var depts = results.map(v => { var res= {name:v.name, value: v.id}; return res});        
      if (onDone) onDone(depts);   
    });   
  }

  addNewRole(onDone) {
    console.log("\nAdd New Role"); 
    this.getAllDepatmentNames((depts)=>{
    inquirer
      .prompt([{
          type: 'input',
          name: 'title',
          message: 'What is the title of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?',
        }, 
        {
          type: 'list',
          name: 'deptId',
          message: 'Which is the department the role belongs to?',
          choices: depts
        }
      ])
      .then(val => {
        if (val) {
          this.insertRole(val, onDone);
        }
      });

    });
  }
}


module.exports = Role;