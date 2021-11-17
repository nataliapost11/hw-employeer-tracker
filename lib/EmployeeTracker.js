const inquirer = require("inquirer");
const chalk = require("chalk");
const Department = require("./Department");
const Role = require("./Role");
const Employee = require("./Employee");

const MainMenuOptions = {
  ViewAllDepartments: 'View all departments',
  ViewAllRoles: 'View all roles',
  ViewAllEmployees: 'View all employees',
  AddDepartment: 'Add a department',
  AddRole: 'Add a role',
  AddEmployee: 'Add an employee',
  UpdateEmployeeRole: 'Update an employee role',
  Quit: 'Quit'
};
const MainMenuOptionsTexts = [
  MainMenuOptions.ViewAllDepartments,
  MainMenuOptions.ViewAllRoles,
  MainMenuOptions.ViewAllEmployees,
  MainMenuOptions.AddDepartment,
  MainMenuOptions.AddRole,
  MainMenuOptions.AddEmployee,
  MainMenuOptions.UpdateEmployeeRole,
  MainMenuOptions.Quit
];

const clearWindow = () => process.stdout.write("\u001b[2J\u001b[0;0H");


// The EmployeeTracker is responsible performing the basic content ma
class EmployeeTracker {

  department = new Department(null);
  employee = new Employee(null);
  role = new Role(null);

  constructor(db) {
    this.db = db;
    this.department = new Department(this.db);
    this.employee = new Employee(this.db);
    this.role = new Role(this.db);
  }

  start() {
    clearWindow();
    this.showMainMenu();
  }

  renderHeader(){
    console.log("______________________________________");
    console.log("*          EMPLOYEE TRACKER          *");
    console.log("*              Main Menu             *");
    console.log("______________________________________");
  }

  showMainMenu() { 
    this.renderHeader();
    inquirer
      .prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: MainMenuOptionsTexts
      }])
      .then(val => {
        if (val.choice == 'Quit') {
          this.quit();
        } else {
          switch (val.choice) {
            case MainMenuOptions.Quit:
              this.quit();
              return;
            case MainMenuOptions.ViewAllDepartments:
              this.department.getAllDepartments(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.ViewAllRoles:
              this.role.getAllRoles(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.ViewAllEmployees:
              this.employee.getAllEmployees(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.AddDepartment:
              this.department.addNewDepartment(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.AddRole:
              this.role.addNewRole(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.AddEmployee:
              this.employee.addNewEmployee(() => {
                this.showMainMenu();
              });
              break;
            case MainMenuOptions.UpdateEmployeeRole:
              this.employee.updateEmployeeRole(() => {
                this.showMainMenu();
              });
              break;
          }
        }
      });
  }

  // Logs goodbye and exits the node app
  quit() {
    this.db.end();
    console.log("\nGoodbye!");
    process.exit(0);
  }
}

module.exports = EmployeeTracker;