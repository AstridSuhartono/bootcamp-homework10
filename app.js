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

//get the information on the team manager and added into employees array. After that render the array into html page and output it into a file
async function init(){
    console.log(`Welcome to team generator application!
----Please enter the team manager information first.---`);
    const managerData = await promptManagerInfo();
    const manager = new Manager(managerData.managerName, managerData.managerId, managerData.managerEmail, managerData.managerOfficeNumber);
    const employeesArray = await createEmployeesArray();
    employeesArray.push(manager);
    const renderedData = render(employeesArray);
    checkFolder();
    await writeFileAsync(outputPath,renderedData);
}

//create the array for all the employees that user adds
async function createEmployeesArray() {
    let newEmployee = {};
    const answers = await inquirer.prompt([
        {
            type:"confirm",
            message: "Add a new member to the team? (hit enter for YES)",
            name: "addEmployee",
            default: true
        }
    ]);

    if (answers.addEmployee) {
        newEmployee = await createEmployeeInfo();
        employees.push(newEmployee);
        console.log("----New member added into the team.----")
        await createEmployeesArray();
    } else {
        console.log("----No more members added into the team.----");
    }
    return employees;
}

//check if the folder to generate the html page exists, if not create one
function checkFolder() {
    try{
        if(!fs.existsSync(OUTPUT_DIR)){
            fs.mkdirSync(OUTPUT_DIR);
        }
    } catch (err) {
        console.log(err);
    }
}

//save the information of a new employee besed on their role and return it as a variable
async function createEmployeeInfo(employee) {
    try {
        const data = await promptEmployeeRole();
        const employeeRole = data.role;
        if(employeeRole === "Engineer"){
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

//getting the employee role that is going to be added into the team
function promptEmployeeRole(){
    return inquirer.prompt([
        {
            type: "list",
            message: "Which employee role to be inserted into the data?",
            name: "role",
            choices: [
                "Engineer", 
                "Intern",
            ],
            default: 0
        }
    ]);
}

//questions to get information on manager
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
            default: 0,
            validate: validateNumberInput
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What is the manager's email?",
            default: "default@email.com",
            validate: validateEmailInput
        },
        {
            type: "input",
            name: "managerOfficeNumber",
            message: "What is the manager's office number?",
            default: 0,
            validate: validateNumberInput
        }
    ]);
}

//questions to get information on engineer
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
            default: 0,
            validate: validateNumberInput
        },
        {
            type: "input",
            name: "engineerEmail",
            message: "What is the engineer's email?",
            default: "default@email.com",
            validate: validateEmailInput
        },
        {
            type: "input",
            name: "engineerGithub",
            message: "What is the engineer's github username?",
            default: "N/A" 
        }
    ]);
}

//questions to get information on intern
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
            default: 0,
            validate: validateNumberInput
        },
        {
            type: "input",
            name: "internEmail",
            message: "What is the intern's email?",
            default: "default@email.com",
            validate: validateEmailInput
        },
        {
            type: "input",
            name: "internSchool",
            message: "What is the intern's school name?",
            default: "N/A" 
        }
    ]);
}

//to validate that input is numbers only
function validateNumberInput(value) {
    var num = value.match( /^[0-9]+$/);
    if(num){
        return true;
    }
    return `Please enter a valid number`;
}

//to validate that input is a proper email address
function validateEmailInput(value) {
    var email = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
    if(email){
        return true;
    }
    return `Please enter a valid email address`;
}
//start the application
init();

