const inquirer = require("inquirer");
require("console.table");

// The class responsible for retrieving and storing employee details from the database
class Employee {

  constructor(db) {
    this.db = db;
  }

  getAllEmployees(onDone) {
    const sql = `
    SELECT e.id ID, e.first_name 'First Name', e.last_name 'Last Name',
    r.title 'Job Title', d.name Department, r.salary Salary, CONCAT(m.first_name, ' ', m.last_name) Manager   
    FROM employee e 
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id 
    `;
    this.db.query(sql, function (err, results) {
      console.log("\nList of all employees");
      if(results.length) console.table(results);
      else console.log("No employees available");
      if (onDone) onDone();
    });
  }

  
  getAllRoleNames(onDone) {     
    const sql = `SELECT r.id, r.title FROM role r`;
    this.db.query(sql, function (err, results) { 
      if(err) console.log(err); 
      var roles = results.map(v => { var res= {name:v.title, value: v.id}; return res});        
      if (onDone) onDone(roles);   
    });   
  }
  
  getAllEmployeeNames(onDone) {     
    const sql = `SELECT id, first_name, last_name FROM employee`;
    this.db.query(sql, function (err, results) { 
      if(err) console.log(err); 
      var emps = results.map(v => { var res= {name:v.first_name + ' ' + v.last_name, value: v.id}; return res;}); 
      if (onDone) onDone(emps);   
    });   
  }

  insertEmployee(empData, onDone) {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [empData.firstName, empData.lastName, empData.roleId, empData.managerId];
    this.db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added the employee");
      }
      if (onDone) onDone();
    });
  }
  
  updateEmployee(empData, onDone) {
    const sql = `UPDATE employee set role_id = ? WHERE id= ?`;
    const params = [empData.roleId, empData.id];
    this.db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully updated the employee role");
      }
      if (onDone) onDone();
    });
  }

  addNewEmployee(onDone) {
    console.log("\nAdd New Employee");
    this.getAllRoleNames((roles)=>{

      this.getAllEmployeeNames((mgrs)=>{
      mgrs.unshift({name:"None", value:null});
      inquirer
        .prompt([{
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of the employee?',
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the last name of the employee?',
        }, {
          type: 'list',
          name: 'roleId',
          message: 'What is the role of the employee?',
          choices: roles,
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Who is the manager of the employee?',
          choices: mgrs
        }    
        ])
        .then(val => {
          if (val.firstName) {
            this.insertEmployee(val, onDone);
          }
        });

      });

    });
  }

  updateEmployeeRole(onDone) {
    console.log("\nUpdate Employee");
    this.getAllEmployeeNames((emps)=>{ 
      this.getAllRoleNames((roles)=>{
        inquirer
          .prompt([{
              type: 'list',
              name: 'id',
              message: 'Who is the employee?',
              choices: emps
            },
            {
              type: 'list',
              name: 'roleId',
              message: 'What is the new role?',
              choices: roles
            }
          ])
          .then(val => {
            if (val) {
              this.updateEmployee(val, onDone);
            }
          });
        });
      });
  }
}

module.exports = Employee;