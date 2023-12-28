const { sequelize } = require("./models");

sequelize.sync({ force: true });

module.exports = {
  testEnvironment: "node",
  // setupFilesAfterEnv: ["./setup.js"],
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
};
