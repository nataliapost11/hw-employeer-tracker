const EmployeeTracker = require("./lib/EmployeeTracker");

// Import and require mysql2
const mysql = require('mysql2');
// Connect to database
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL username   
  password: 'root', // MySQL password
  database: 'employee_db'
});

dbConnection.connect(function (err) {
  if (err) throw err; 
  console.log(`Connected to the employee_db database.`);
  // Initialize a new EmployeeTracker object
  const empTracker = new EmployeeTracker(dbConnection);

  // Start the application
  empTracker.start();

})