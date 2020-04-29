const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeFileAsync = util.promisify(fs.writeFile);

let employees = [];

async function init(){
    let employees = await createEmployeesArray();
    console.log("this is array from init:"+ employees);
    let renderedData = render(employees);
    checkFolder();
    await writeFileAsync(outputPath,renderedData);
}

async function createEmployeesArray() {
    let newEmployee = {};
    const answers = await inquirer.prompt([
        {
            type:"confirm",
            message: "Add employees? (hit enter for YES)",
            name: "addEmployee",
            default: true
        }
    ]);

    if (answers.addEmployee) {
        newEmployee = await createEmployeeInfo();
        employees.push(newEmployee);
        await createEmployeesArray();
    } else {
        console.log("No more employees added to the team");
    }
    console.log("this is array from create array:"+ employees);
    return employees;
}

function checkFolder() {
    try{
        if(!fs.existsSync(OUTPUT_DIR)){
            fs.mkdirSync(OUTPUT_DIR);
        }
    } catch (err) {
        console.log(err);
    }
}

async function createEmployeeInfo(employee) {
    try {
        const data = await promptEmployeeRole();
        const employeeRole = data.role;
        if(employeeRole === "Manager"){
            const managerData = await promptManagerInfo();
            employee = new Manager(managerData.managerName, managerData.managerId, managerData.managerEmail, managerData.managerOfficeNumber);

        } else if(employeeRole === "Engineer"){
            const engineerData = await promptEngineerInfo();
            employee = new Engineer(engineerData.engineerName, engineerData.engineerId, engineerData.engineerEmail, engineerData.engineerGithub);
            
        } else {
            const internData = await promptInternInfo();
            employee = new Intern(internData.internName, internData.internId, internData.internEmail, internData.internSchool);
        }
        return employee;  
    } 
    catch(err) {
        console.log(err);
    }
}

function promptEmployeeRole(){
    return inquirer.prompt([
        {
            type: "list",
            message: "Which employee role to be inserted into the data?",
            name: "role",
            choices: [
                "Manager", 
                "Engineer", 
                "Intern",
            ],
            default: 0
        }
    ]);
}

function promptManagerInfo(){
    return inquirer.prompt([
        {
            type: "input",
            name: "managerName",
            message: "What is the manager's name?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "managerId",
            message: "What is the manager's ID number?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What is the manager's email?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "managerOfficeNumber",
            message: "What is the manager's office number?",
            default: "N/A" 
        }
    ]);
}

function promptEngineerInfo(){
    return inquirer.prompt([
        {
            type: "input",
            name: "engineerName",
            message: "What is the engineer's name?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "engineerId",
            message: "What is the engineer's ID number?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "engineerEmail",
            message: "What is the engineer's email?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "engineerGithub",
            message: "What is the engineer's github username?",
            default: "N/A" 
        }
    ]);
}

function promptInternInfo(){
    return inquirer.prompt([
        {
            type: "input",
            name: "internName",
            message: "What is the intern's name?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "internId",
            message: "What is the intern's ID number?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "internEmail",
            message: "What is the intern's email?",
            default: "N/A" 
        },
        {
            type: "input",
            name: "internSchool",
            message: "What is the intern's school name?",
            default: "N/A" 
        }
    ]);
}

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
