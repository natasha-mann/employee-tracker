const leftJoin = () => {
  return `
SELECT ?? as ?, ?? as ?, ?? as ?
FROM ?? 
LEFT JOIN ?? ON ?? = ??
`;
};

const generateEmployeeChoices = (employees) => {
  return employees.map((employee) => {
    return {
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    };
  });
};

const generateRoleChoices = (roles) => {
  return roles.map((role) => {
    return {
      name: role.title,
      value: role.id,
    };
  });
};

const generateDepartmentChoices = (departments) => {
  return departments.map((department) => {
    return {
      name: department.name,
      value: department.id,
    };
  });
};

module.exports = {
  leftJoin,
  generateEmployeeChoices,
  generateRoleChoices,
  generateDepartmentChoices,
};
