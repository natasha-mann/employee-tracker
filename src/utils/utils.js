const generateEmployeeChoices = (employees) => {
  return employees.map((employee) => {
    return {
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    };
  });
};

const generateChoices = (array, value) => {
  return array.map((each) => {
    return {
      name: each[value],
      value: each.id,
    };
  });
};

module.exports = {
  generateEmployeeChoices,
  generateChoices,
};
