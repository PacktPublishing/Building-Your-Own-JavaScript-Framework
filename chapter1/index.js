const inquirer = require('inquirer');

console.log('Welcome to the Framework Showcase!');

const prompt = [
  {
    type: 'list',
    name: 'framework',
    message: 'Choose the framework to showcase',
    choices: ['React', 'Vue'],
  },
];

inquirer.prompt(prompt).then((answers) => {
  console.log('\Result:');
  console.log(JSON.stringify(answers, null, '  '));
});