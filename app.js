const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeFileAsync = util.promisify(fs.writeFile);

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function promptEmployeeClass(){
    return inquirer.prompt([
        {
            type: "list",
            message: "Which employee role to enter the data?",
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

async function populateEmployeeInfo() {
    try{
        const data = await promptEmployeeClass();
        const employeeRole = data.role;
        const employees = [];
        if(employeeRole === "Manager"){
            const managerData = await promptManagerInfo();
            manager = new Manager(managerData.managerName,managerData.managerId,managerData.managerEmail,managerData.managerOfficeNumber);
            employees.push(manager);

        } else if(employeeRole === "Engineer"){
            const engineerData = await promptEngineerInfo();
            engineer = new Engineer(engineerData.engineerName,engineerData.engineerId,engineerData.engineerEmail,engineerData.engineerGithub);
            employees.push(engineer);
        } else {
            const internData = await promptInternInfo();
            intern = new Intern(internData.internName,internData.internId,internData.internEmail,internData.internSchool);
            employees.push(intern);
        }
        let renderedData = render(employees);
        await writeFileAsync(OUTPUT_DIR.outputPath,renderedData);
    } catch(err) {
        console.log(err);
    }
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

populateEmployeeInfo();


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
