<h1>Employee Tracker</h1>

<h2> Table of Contents </h2>

- [About the Project](#about-the-project)
  - [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Launch the app](#launch-the-app)
- [Demo Video](#demo-video)
- [Questions](#questions)

## About the Project

This app was built using Node.js and the inquirer package for the back end, with MySQL for the database. The user is prompted with a set of choices representing actions that can be taken to manipulate the data.

The user is able to build up data for a company, with tables for departments, job roles and employees. Once the data has been added, the user can view the data tables in the terminal using the "view" options, or can choose to add to, update or delete certain data.

### Features

- Validation for input fields to ensure they are not left blank or filled with incorrect values.
- Confirmation questions on delete options to ensure the user knows exactly what they are deleting.
- Control flow to ensure the app doesn't break if the user selects an option which isn't possible (eg. if the user selects to delete a department when none exist) and instead presents the user with an alert to let them know their choice isn't possible.
- Table joins to present the user with data combined from the three different tables.

## Getting Started

### Installation

```
git clone https://github.com/natasha-mann/employee-tracker.git
cd employee-tracker
npm i
```

### Launch the app

```
npm run start
```

## Demo Video

Please click [here]() to view the demo.

## Questions

If you have any questions about this application, please contact me by [email](mailto:natasha.s.mann@gmail.com).
