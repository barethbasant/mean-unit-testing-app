"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("dueDate");
          return rawValue
            ? new Date(rawValue).toISOString().split("T")[0]
            : null;
        },
        set(value) {
          // Assuming that value is a string in the "YYYY-MM-DD" format
          this.setDataValue("dueDate", value);
        },
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
